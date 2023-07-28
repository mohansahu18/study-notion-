const Profile = require("../models/profile")
const User = require("../models/user")
const uploadImageToCloudinary = require("../utils/imageUploader")
require("dotenv").config()
const updateProfile = async (req, res) => {
    try {
        // fetch data
        const { gender, dateOfBirth = "", about = "", contactNumber } = req.body
        const { userId } = req.user.id

        // validate
        if (!gender || !dateOfBirth || !about || !contactNumber) {
            return res.status(403).json({
                success: false,
                message: "please fill all the fields"
            })
        }

        // update profile
        const profileId = userId.additionalDetails
        const updatedProfile = await Profile.findByIdAndUpdate(
            { _id: profileId },
            {
                gender,
                dateOfBirth,
                about,
                contactNumber
            },
            { new: true }
        )

        // return success response
        return res.status(200).json({
            success: true,
            message: "profile updated successfully",
            data: updatedProfile
        })
    } catch (err) {
        console.log("error in updating a profile ", err);
        return res.status(500).json({
            success: false,
            message: "not able to update profile",
            error: err.message
        })
    }
}

const deleteAccount = async (req, res) => {
    try {
        // fetch data
        const { userId } = req.user.id
        const userDetail = User.findById(userId)
        // validate
        if (!userDetail) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        // delete profile of of the user
        const profileId = userDetail.additionalDetails
        const deletedProfile = await Profile.findByIdAndDelete({ profileId })
        // delete user
        const deletedUser = await User.findByIdAndDelete({
            _id: userId
        })

        // return success response
        return res.status(200).json({
            success: true,
            message: "user deleted successfully",
            deletedUser: deletedUser
        })

    } catch (err) {
        console.log("error in deleting a profile ", err);
        return res.status(500).json({
            success: false,
            message: "not able to delete profile",
            error: err.message
        })

    }
}

const updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture
        console.log(`display picture  ; -> ${displayPicture}`);
        const userId = req.user.id
        console.log(`userId : - > ${userId}`);
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(`image are : - > ${image}`)
        const updatedProfile = await User.findByIdAndUpdate(
            { _id: userId },
            { image: image.secure_url },
            { new: true }
        )
        res.status(200).json({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "issue with updating the profile picture",
            error: err.message,
        })
    }
};

module.exports = { updateProfile, deleteAccount, updateDisplayPicture }