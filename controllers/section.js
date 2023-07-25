const Section = require("../models/section")
const Course = require('../models/course')
const createSection = async (req, res) => {
    try {
        // data fetch
        const { sectionName, courseId } = req.body

        // validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "all fields are require"
            })
        }

        // create entry
        const newSection = await Section.create({
            sectionName
        })

        // update course with section objectId
        const updatedCourse = await Course.findByIdAndUpdate(
            { _id: courseId },
            { $push: { courseContent: newSection._id } },
            { new: true }
        )

        // return success response
        return res.status(201).json({
            success: true,
            message: "section created successfully",
            data: newSection
        })
    } catch (err) {
        console.log("error in creating a section ", err);
        return res.status(500).json({
            success: true,
            message: "not able to create section",
            error: err.message
        })
    }
}

module.exports = { createSection }