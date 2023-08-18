const Course = require("../models/course")
const User = require('../models/user')
const Category = require("../models/category")
const uploadImageToCloudinary = require("../utils/imageUploader")
require("dotenv").config()

// create course handler function
const createCourse = async (req, res) => {
    try {
        // fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, category, tags } = req.body

        // fetch thumbnail
        const thumbnail = req.files.thumbnailImage

        // validation
        if (!courseDescription || !courseName || !whatYouWillLearn || !price
            || !thumbnail
        ) {
            return res.status(400).json({
                success: false,
                message: "all fields are require"
            })
        }

        // check for instructor
        const userId = req.user.id
        const instructorDetail = await User.findById(userId)
        console.log(`instructorDetail : - > ${instructorDetail}`);
        if (!instructorDetail) {
            return res.status(404).json({
                success: false,
                message: "instructor detail not found"
            })
        }

        // check given category is valid or not
        const categoryDetail = await Category.findById(category)
        if (!categoryDetail) {
            return res.status(404).json({
                success: false,
                message: "category details not found"
            })
        }

        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        // create entry of new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            price,
            category,
            whatYouWillLearn,
            instructor: instructorDetail?._id,
            thumbnail: thumbnailImage?.secure_url,
            tags
        })

        //add new course in user schema of instructor
        await User.findByIdAndUpdate(
            { _id: instructorDetail._id },
            {
                $push: {
                    courses: newCourse._id
                }
            },
            { new: true }
        )

        // update category schema
        await Category.findByIdAndUpdate(
            { _id: categoryDetail._id },
            {
                $push: {
                    course: newCourse._id
                }
            },
            { new: true }
        )

        // return success response
        return res.status(201).json({
            success: true,
            message: "course created successfully",
            data: newCourse
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "not able to create course"
        })
    }
}

// get all course handler function
const showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReview: true,
            studentEnroll: true
        }).populate("instructor").exec()
        return res.status(200).json({
            success: true,
            message: "successfully fetch the all  courses",
            data: allCourses
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "not able to fetch the course",
            error: err.message
        })
    }
}

// get all detail of particular course
const getCourseDetail = async (req, res) => {
    try {
        // fetch course id
        const { courseId } = req.body

        // display details
        const courseDetail = await Course.find(
            { _id: courseId }).populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails"
                }
            })
            .populate("category")
            // .populate("RatingAndReview")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            })
            .exec()

        // validate
        if (!courseDetail) {
            return res.status(404).json({
                success: false,
                message: `could not find course with ${courseId}`
            })
        }

        // return success response
        return res.status(200).json({
            success: true,
            message: "successfully fetch the course detail",
            data: courseDetail
        })
    } catch (err) {
        console.log(`error while fetching the course detail : - >${err}`);
        return res.status(500).json({
            success: false,
            message: 'error while fetching the course detail',
            error: err.message
        })
    }
}
module.exports = { createCourse, showAllCourses, getCourseDetail }