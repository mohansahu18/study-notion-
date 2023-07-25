const Course = require("../models/course")
const User = require('../models/course')
const Tags = require("../models/tags")
const uploadImageToCloudinary = require("../utils/imageUploader")
require("dotenv").config()

// create course handler function
const createCourse = async (req, res) => {
    try {
        // fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, tags } = req.body

        // fetch thumbnail
        const { thumbnail } = req.files.thumbnailImage

        // validation
        if (!courseDescription || !courseName || !whatYouWillLearn || !price || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "all fields are require"
            })
        }

        // check for instructor
        const userId = req.User.id
        const instructorDetail = await User.findById(userId)
        console.log(`instructorDetail : - > ${instructorDetail}`);
        if (!instructorDetail) {
            return res.status(404).json({
                success: false,
                message: "instructor detail not found"
            })
        }

        // check given tag is valid or not
        const tagDetail = await Tags.findById(tags)
        if (!tagDetail) {
            return res.status(404).json({
                success: false,
                message: "tags details not found"
            })
        }

        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnailImage, process.env.FOLDER_name)

        // create entry of new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            price,
            tags,
            whatYouWillLearn,
            instructor: instructorDetail._id,
            thumbnail: thumbnailImage.secure_url
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

        // update tags schema
        await Tags.findByIdAndUpdate(
            { _id: tagDetail._id },
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

module.exports = { createCourse }