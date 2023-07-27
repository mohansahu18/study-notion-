const RatingAndReview = require("../models/ratingAndReview")
const User = require("../models/user")
const Course = require("../models/course")

// create rating handler function
const createRating = async (req, res) => {
    try {
        // fetch data
        const { rating, review, courseId } = req.body
        const { userId } = req.user.id

        // validate data
        if (!rating || !review || !course || !user) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }

        // verify user is enroller in course not not
        const userDetail = await Course.findById(userId)
        if (!userDetail.courses(includes(courseId))) {
            return res.status(400).json({
                success: false,
                message: "user is not enroll in the course"
            })
        }
        // check if user is already reviewed the course
        const alreadyReview = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        })
        if (alreadyReview) {
            return res.status(404).json({
                success: false,
                message: "user has already reviewed the course"
            })
        }

        // create entry in db
        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId
        })

        // update course with ratingReview objectId
        const updatedCourseDetail = await Course.findByIdAndUpdate({ courseId },
            {
                $push: {
                    ratingAndReview: ratingReview._id
                }
            },
            { new: true })

        // return success response
        return res.status(201).json({
            success: true,
            message: "successfully created rating and review",
            ratingReview: ratingReview
        })

    } catch (err) {
        console.log(`issue with creating a rating : - >${err}`);
        return res.status(500).json({
            success: false,
            message: "not able to create a rating",
            error: err.message
        })

    }
}
// get average rating handler function
// get all rating handler function

