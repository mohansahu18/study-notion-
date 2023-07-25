const Section = require("../models/section")
const Course = require('../models/course')

// create section handler
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

// update section handler
const updateSection = async (req, res) => {
    try {
        // fetch data
        const { sectionId, sectionName } = req.body

        // validate
        if (!sectionId || !sectionName) {
            return res.status(400).json({
                success: false,
                message: "all fields are require"
            })

        }

        // update section
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { sectionName },
            { new: true }
        )

        // return success response
        return res.status(201).json({
            success: true,
            message: "section updated successfully",
            data: updatedSection
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

const deleteSection = async (req, res) => {
    try {
        // fetch data
        const { sectionId } = req.params

        // validate
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: "section id is require"
            })
        }

        // delete section
        const deletedSection = await Section.findByIdAndDelete(
            { sectionId }
        )

        // return success response
        return res.status(201).json({
            success: true,
            message: "section deleted successfully",
            data: deletedSection
        })

    } catch (err) {
        console.log("error in deleting a section ", err);
        return res.status(500).json({
            success: true,
            message: "not able to delete section",
            error: err.message
        })

    }
}

module.exports = { createSection, updateSection, deleteSection }