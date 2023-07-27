const SubSection = require("../models/subSection")
const Section = require("../models/section")
const CourseProgress = require("../models/courseProgress")
const uploadImageToCloudinary = require("../utils/imageUploader")
const { ObjectId } = require('mongoose');

const createSubSection = async (req, res) => {
    try {
        // fetch data
        const { sectionId, title, description, timeDuration } = req.body

        // fetch file
        const video = req.files.videoFile

        // validate
        if (!title || !description || !sectionId || !timeDuration || !video) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }

        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)

        // create subSection
        const newSubSection = await SubSection.create({
            title,
            description,
            timeDuration,
            videoUrl: uploadDetails.secure_url
        })

        // update section with sub section objectId
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { $push: { subSection: newSubSection._id } },
            { new: true }
        )

        // return success response
        return res.status(201).json({
            success: true,
            message: "sub section created successfully",
            data: newSubSection
        })
    }
    catch (err) {
        console.log("error in creating a sub section ", err);
        return res.status(500).json({
            success: false,
            message: "not able to create sub section",
            error: err.message
        })

    }
}

const updateSubSection = async (req, res) => {
    try {
        // fetch data
        const { subSectionId, title, description, timeDuration, sectionId } = req.body
        const video = req.files.videoFile

        // validate
        if (!subSectionId || !title || !description || !timeDuration || !video) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }

        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)

        // update subSection
        const updatedSubSection = await SubSection.findByIdAndUpdate(
            { _id: subSectionId },
            {
                title,
                description,
                timeDuration,
                videoUrl: uploadDetails.secure_url
            },
            { new: true }
        )

        // update section with sub section objectId
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $push: {
                    subSection: updatedSubSection._id
                }
            },
            { new: true }
        )

        // return success response
        return res.status(201).json({
            success: true,
            message: "sub section updated successfully",
            data: updatedSubSection
        })
    } catch (err) {
        console.log(`not able to update sub section : - > ${updateSubSection}`);
        return res.status(500).json({
            success: false,
            message: "not able to update sub section",
            error: err.message
        })
    }
}

const deleteSubSection = async (req, res) => {
    try {
        // fetch data
        const { subSectionId } = req.params
        let deletedSubSection;
        if (!ObjectId.isValid(subSectionId)) {
            return res.status(400).json({
                success: false,
                message: "sub section id is required"
            })
        }
        else {
            deletedSubSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
            if (!deletedSubSection) {
                return res.status(404).json({
                    success: false,
                    message: "sub section not found"
                })
            }
        }
        return res.status(200).json({
            success: true,
            message: "sub section deleted successfully",
            data: deletedSubSection
        })


    } catch (err) {
        console.log(`not able to delete subsection ${err}`);
        return res.status(500).json({
            success: false,
            message: "not able to delete subsection",
            error: err.message
        })
    }
}

module.exports = { createSubSection, updateSubSection, deleteSubSection }