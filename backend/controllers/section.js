const Section = require("../models/section")
const Course = require('../models/course')
const SubSection = require("../models/subSection")
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
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })


        // return success response
        return res.status(201).json({
            success: true,
            message: "section created successfully",
            data: updatedCourse
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
        const { sectionId, sectionName, courseId } = req.body

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

        const course = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
        // return success response
        return res.status(201).json({
            success: true,
            message: "section updated successfully",
            data: course
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
        const { sectionId, courseId } = req.body

        // validate
        if (!sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "section id and course id is require"
            })
        }
        const section = await Section.findById(sectionId)
        if (!section) {
            return res.status(400).json({
                success: false,
                message: "section id is not valid"
            })
        }

        // delete section
        const deletedSection = await Section.findByIdAndDelete(
            sectionId
        )

        // delete section id from course schema
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,
            }
        })

        // delete section id from sub section
        await SubSection.deleteMany({ _id: { $in: section.subSection } });
        console.log(`subsection del : - >${await SubSection.deleteMany({ _id: { $in: section.subSection } })}`);

        //find the updated course and return 
        const course = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        })

        // return success response
        return res.status(201).json({
            success: true,
            message: "section deleted successfully",
            data: course
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