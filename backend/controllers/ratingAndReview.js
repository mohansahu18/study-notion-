const RatingAndReview = require("../models/ratingAndReview")
const User = require("../models/user")
const Course = require("../models/course")
const { default: mongoose } = require("mongoose")


// create rating handler function
const createRating = async (req, res) => {
    try {
        // fetch data
        const { rating, review, courseId } = req.body
        const userId = req.user.id
        console.log("rating", rating);
        console.log("review", review);
        console.log("course id", courseId);
        console.log("user id ", userId);

        // validate data
        if (!rating || !review || !courseId || !userId) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }

        // verify user is enroller in course not not
        const userDetail = await User.findById(userId)
        if (!userDetail.courses.includes(courseId)) {
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
        const updatedCourseDetail = await Course.findByIdAndUpdate(courseId,
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
const getAverageRating = async (req, res) => {
    try {
        // fetch data
        const courseId = req.body.courseId

        // calculate Average rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Schema.Types.ObjectId(courseId)
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: { $rating }
                    }
                }
            }
        ])

        // return rating
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                message: "successfully get average rating",
                averageRating: result[0].averageRating
            })
        }
        // if no rating is there
        return res.status(404).json({
            success: false,
            message: "no rating found",
            averageRating: 0
        })


    } catch (err) {
        console.log(`issue with getting average rating : - >${err}`);
        return res.status(500).json({
            success: false,
            message: "not able to get average rating",
            error: err.message
        })
    }
}

// get all rating handler function
const getAllRatingAndReview = async (req, res) => {
    try {
        const allRatingAndReview = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image"
            })
            .populate({
                path: "course",
                select: "courseName"
            })
        // const allRatingAndReview = await RatingAndReview.find({})
        //     .populate("course").populate("user")
        // console.log("allRatingAndReview : - >", allRatingAndReview);
        return res.status(200).json({
            success: true,
            message: "successfully get all rating and review",
            data: allRatingAndReview
        })
    } catch (err) {
        console.log(`issue with getting rating and review : - >${err}`);
        return res.status(500).json({
            success: false,
            message: "not able to get rating and review",
            error: err.message
        })
    }
}

module.exports = { createRating, getAverageRating, getAllRatingAndReview }
