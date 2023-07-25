const SubSection = require("../models/subSection")
const Section = require("../models/section")
const CourseProgress = require("../models/courseProgress")
const uploadImageToCloudinary = require("../utils/imageUploader")

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

module.exports = { createSubSection }