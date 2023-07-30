const instance = require("../config/razorpay")
const User = require("../models/user")
const Course = require('../models/course')
const { default: mongoose } = require("mongoose")
const mailSender = require("../utils/mailSender")

// capture payment and initiates razorpay
const capturePayment = async (req, res) => {
    try {
        // fetch data
        const { course_id } = req.body
        const { user_id } = req.user.id

        // validation
        if (!course_id || !user_id) {
            return res.status(400).json({
                success: false,
                message: "courseId and userId is required"
            })
        }

        // validate course details
        let course;
        try {
            courseDetail = await Course.findById(course_id)
            if (!courseDetail) {
                return res.status(404).json({
                    success: false,
                    message: "not able to find course"
                })
            }

            // validate user already pay the course or not
            const uid = new mongoose.Types.ObjectId(user_id)
            if (Course.studentEnroll.includes(uid)) {
                return res.status(200).json({
                    success: false,
                    message: "user is already enroll"
                })
            }
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "something went wrong while validating course",
                error: err.message
            })
        }

        // create order
        const amount = courseDetail.price
        const currency = 'INR'
        const options = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes: {
                course_id,
                user_id,
            }
        }
        try {
            // initiates the using razorpay
            const paymentResponse = await instance.crete(options)
            console.log(`payment response : - >${paymentResponse}`);

            // send success response
            return res.status(200).json({
                success: true,
                message: "payment initiated successfully",
                courseName: courseDetail.courseName,
                courseDescription: courseDetail.courseDescription,
                thumbnail: courseDetail.thumbnail,
                orderId: paymentResponse.id,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'not able to create payment order'
            })
        }
    }
    catch (err) {
        console.log(`issue with capturing the payment: - >${err}`);
        return res.status(500).json({
            success: false,
            message: "issue with capturing the payment",
            error: err.message
        })
    }
}

// verify signature of razorpay and server
const verifySignature = async (req, res) => {
    try {
        const webhookSecrete = '123456'
        const shasum = crypto.creteHmac('sha256', webhookSecrete)
        shasum.update(JSON.stringify(req.body))
        const digest = shasum.digest("hex")
        // extracting from header
        const signature = req.header['x-razorpay-signature']
        if (digest === signature) {
            console.log('payment is authorised');
            const { course_id, user_id } = req.body.payload.payment.entity.notes
            // update studentId in course schema
            try {
                const enrolledCourses = await Course.findByIdAndUpdate({ id: course_id },
                    {
                        $push: {
                            studentEnroll: user_id
                        }
                    },
                    { new: true }
                )
                if (!enrolledCourses) {
                    return res.status(404).json({
                        success: false,
                        message: "not able to enroll user"
                    })
                }
                console.log(`enrolledCourses : - > ${enrolledCourses}`);

                // find the student and add the course list in enrollCourses of student
                const enrolledStudent = await User.findByIdAndUpdate({ user_id }, {
                    $push: {
                        courses: course_id
                    }
                }, { new: true })
                console.log(`enrollStudent : - > ${enrolledStudent}`);

                // send mail to the student
                const emailResponse = await mailSender(
                    enrolledStudent.email,
                    "congratulation from study notion",
                    "congratulation you are enborded into new study notion courses"
                )
                console.log(`email response : - > ${emailResponse}`);

                // return success response
                return res.status(200).json({
                    success: true,
                    message: "signature verified successfully"
                })
            } catch (err) {
                console.log(`signature could not verified ${err}`);
                return res.status(500).json({
                    success: false,
                    message: "signature could not verified"
                })
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "invalid request"
            })
        }
    } catch (err) {
        console.log(`error with verifying the signature : - > ${err}`);
        return res.status(500).json({
            success: false,
            message: 'issue with verifying signature',
            error: err.message
        })
    }
}

module.exports = { capturePayment, verifySignature }