const Profile = require("../models/profile")
const User = require("../models/user")
const CourseProgress = require("../models/courseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")
const Course = require("../models/course")
const uploadImageToCloudinary = require("../utils/imageUploader")
require("dotenv").config()
const updateProfile = async (req, res) => {
    try {
        // fetch data
        const { gender, dateOfBirth = "", about = "", contactNumber, } = req.body
        // const { userId } = req.user.id
        const userId = req.user.id;
        console.log(`userId: - > ${userId}`);
        // validate
        if (!gender || !dateOfBirth || !about || !contactNumber) {
            return res.status(403).json({
                success: false,
                message: "please fill all the fields"
            })
        }

        // update profile
        // const profileId = userId.additionalDetails
        const userDetails = await User.findById(userId);
        console.log(`UserDETAIL : - > ${userDetails}`);



        const profileId = userDetails.additionalDetails || null; // Set to null if additionalDetails is missing

        if (!profileId) {
            return res.status(404).json({
                success: false,
                message: "User profile not found or additionalDetails missing"
            });
        }


        console.log("profile id  : - .", profileId);
        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
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
        const userId = req.user.id
        console.log(`user id : - >${userId}`);
        const userDetail = await User.findById(userId)
        console.log(`userdetail : - > ${userDetail}`);
        // validate
        if (!userDetail) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        // delete profile of of the user
        const profileId = userDetail.additionalDetails
        console.log(`profile id : - > ${profileId}`);
        console.log(`type of profile id  : ->${typeof (profileId)}`);
        const deletedProfile = await Profile.findByIdAndDelete(profileId)
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
        console.log("image URL are : - >", image?.secure_url)
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

const getAllUserDetails = async (req, res) => {
    try {
        // const id = req.user.id;
        const userId = req.user.id;
        const userDetails = await User.findById(userId)
            .populate("additionalDetails")
            .exec();
        console.log(userDetails);
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: userDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "fail to fetch user detail",
            error: error.message,
        });
    }
};

const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id
        let userDetails = await User.findOne({
            _id: userId,
        }, { new: true })
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subSection"
                    }
                },
            })

        userDetails = userDetails?.toObject()
        // console.log("user detail : - >", userDetails);
        var SubsectionLength = 0

        for (var i = 0; i < userDetails?.courses?.length; i++) {
            let totalDurationInSeconds = 0;
            let SubsectionLength = 0;

            for (var j = 0; j < userDetails?.courses[i]?.courseContent?.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[j]?.subSection?.reduce((acc, curr) => acc + parseInt(curr?.timeDuration), 0) || 0;

                userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);

                SubsectionLength += userDetails.courses[i].courseContent[j]?.subSection?.length || 0;
            }
            // console.log("course id : ->", userDetails?.courses[i]?._id.toString());
            // console.log("user id : -> ", userId);
            let courseProgressCount = await CourseProgress?.findOne({
                courseId: userDetails?.courses[i]?._id.toString(),
                userId: userId,
            });
            console.log("courseProgressCount : - >", courseProgressCount);
            courseProgressCount = courseProgressCount?.completedVideos?.length || 0;
            console.log("courseProgressCount : - >", courseProgressCount?.completedVideos?.length);
            if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100;
            } else {
                const multiplier = Math.pow(10, 2);
                userDetails.courses[i].progressPercentage = Math.round((courseProgressCount / SubsectionLength) * 100 * multiplier) / multiplier;
            }
        }
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`,
            })
        }
        return res.status(200).json({
            success: true,
            msg: "profile data",
            data: userDetails.courses,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "error occurs in  getEnrolledCourses api"
        })
    }
}

const instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id })

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentEnroll.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                // Include other course properties as needed
                totalStudentsEnrolled,
                totalAmountGenerated,
            }

            return courseDataWithStats
        })

        res.status(200).json({
            success: true,
            message: "successfully fetch data",
            courses: courseData
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error
        })
    }
}
module.exports = { updateProfile, deleteAccount, instructorDashboard, getEnrolledCourses, updateDisplayPicture, getAllUserDetails }