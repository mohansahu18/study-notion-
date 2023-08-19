const Course = require("../models/course")
const User = require('../models/user')
const Category = require("../models/category")
const uploadImageToCloudinary = require("../utils/imageUploader")
require("dotenv").config()

// create course handler function
const createCourse = async (req, res) => {
    try {
        // fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, category, tags: _tags, instructions: _instructions } = req.body

        // fetch thumbnail
        const thumbnail = req.files.thumbnailImage

        // Convert the tag and instructions from stringified Array to Array
        console.log("_tags", _tags);

        // const tags = JSON.parse(_tags)
        const tags = _tags.split(',').map(tag => tag.trim()); // Convert comma-separated string to array
        // const instructions = JSON.parse(_instructions)
        const instructions = _instructions.split(',').map(e => e.trim()); // Convert comma-separated string to array

        console.log("tags", tags)
        console.log("instructions", instructions)

        // validation
        if (!courseDescription || !courseName || !whatYouWillLearn || !price
            || !thumbnail || !tags.length || !instructions.length
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
            tags,
            instructions
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

// Edit Course Details
const editCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const updates = req.body
        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(404).json({ error: "Course not found" })
        }

        // If Thumbnail Image is found, update it
        if (req.files) {
            console.log("thumbnail update")
            const thumbnail = req?.files?.thumbnailImage
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage?.secure_url
        }

        // Update only the fields that are present in the request body
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                if (key === "tags" || key === "instructions") {
                    course[key] = JSON.parse(updates[key])
                } else {
                    course[key] = updates[key]
                }
            }
        }

        await course.save()

        const updatedCourse = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            // .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                    select: "-videoUrl",
                },
            })
            .exec()

        res.json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
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
module.exports = { createCourse, showAllCourses, getCourseDetail, editCourse }