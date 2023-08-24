const SubSection = require("../models/subSection")
const Section = require("../models/section")
const CourseProgress = require("../models/courseProgress")
const uploadImageToCloudinary = require("../utils/imageUploader")
const { ObjectId, isValidObjectId } = require('mongoose');
const createSubSection = async (req, res) => {
    try {
        // fetch data
        const { sectionId, title, description,
            //  timeDuration 
        } = req.body

        // fetch file
        const video = req.files.video



        // validate
        if (!title || !description || !sectionId || !video
            // || !timeDuration
        ) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }

        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)

        // create subSection
        const newSubSection = await SubSection.create({
            title: title,
            description: description,
            videoUrl: uploadDetails.secure_url,
            timeDuration: `${uploadDetails.duration}`,

        })

        // update section with sub section objectId
        const updateSubSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { $push: { subSection: newSubSection._id } },
            { new: true }
        ).populate("subSection")

        // return success response
        return res.status(201).json({
            success: true,
            message: "sub section created successfully",
            data: updateSubSection
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
        const { sectionId, subSectionId, title, description } = req.body
        const subSection = await SubSection.findById(subSectionId)

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            })
        }

        if (title !== undefined) {
            subSection.title = title
        }

        if (description !== undefined) {
            subSection.description = description
        }
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save()

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        )

        // console.log("updated section", updatedSection)

        return res.json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection,
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
        const { subSectionId, sectionId } = req.body

        // validate
        if (!subSectionId || !sectionId) {
            return res.status(404).json({
                success: false,
                message: "all fields are required"
            })
        }
        // remove subsection object id from section schema
        const deletedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId
                }
            }
        )

        // delete subsection
        const deleteSubSection = await SubSection.findByIdAndDelete(subSectionId)

        if (!deleteSubSection) {
            return res
                .status(404)
                .json({ success: false, message: "SubSection not found" })
        }

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        )
        return res.status(200).json({
            success: true,
            message: "sub section deleted successfully",
            data: updatedSection
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