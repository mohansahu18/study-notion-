const Course = require("../models/course")
const User = require('../models/user')
const Category = require("../models/category")
const Section = require("../models/section")
const SubSection = require("../models/subSection")
const CourseProgress = require('../models/courseProgress')
const uploadImageToCloudinary = require("../utils/imageUploader")
require("dotenv").config()

// create course handler function
const createCourse = async (req, res) => {
    try {
        // fetch data
        const { courseName,
            courseDescription,
            status,
            whatYouWillLearn,
            price,
            category,
            tags: _tags,
            instructions: _instructions
        } = req.body

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
        if (!status || status === undefined) {
            status = "Draft"
        }
        // check for instructor
        const userId = req.user.id
        const instructorDetail = await User.findById(userId, {
            accountType: "instructor"
        }
        )
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
            status: status,
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
        const allCourses = await Course.find(
            {
                status: "Published"
            },
            {
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
            .populate("ratingAndReview")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                    select: "-videoUrl",
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
            data: {
                courseDetail,
                // totalDuration,
            },
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

const getInstructorCourses = async (req, res) => {
    try {
        // Get the instructor ID from the authenticated user or request body
        console.log("req; - > ", req.user);
        const instructorId = req.user.id
        // const userId = req.user.id;
        // const instructorId = userId

        // Find all courses belonging to the instructor
        const instructorCourses = await Course.find({
            instructor: instructorId,
        }).sort({ createdAt: -1 })

        // Return the instructor's courses
        res.status(200).json({
            success: true,
            data: instructorCourses,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        })
    }
}

const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body

        // Find the course
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        // Unenroll students from the course
        // const studentsEnrolled = course.studentsEnrolled
        // for (const studentId of studentsEnrolled) {
        //     await User.findByIdAndUpdate(studentId, {
        //         $pull: { courses: courseId },
        //     })
        // }

        // Delete sections and sub-sections
        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
            // Delete sub-sections of the section
            const section = await Section.findById(sectionId)
            if (section) {
                const subSections = section.subSection
                for (const subSectionId of subSections) {
                    await SubSection.findByIdAndDelete(subSectionId)
                }
            }

            // Delete the section
            await Section.findByIdAndDelete(sectionId)
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId)

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

const getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.user.id
        const courseDetails = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReview")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        let courseProgressCount = await CourseProgress.findOne({
            courseId: courseId,
            userId: userId,
        })

        console.log("courseProgressCount : ", courseProgressCount)

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        }

        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }

        // let totalDurationInSeconds = 0
        // courseDetails.courseContent.forEach((content) => {
        //     content.subSection.forEach((subSection) => {
        //         const timeDurationInSeconds = parseInt(subSection.timeDuration)
        //         totalDurationInSeconds += timeDurationInSeconds
        //     })
        // })

        // const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                // totalDuration,
                completedVideos: courseProgressCount?.completedVideos
                    ? courseProgressCount?.completedVideos
                    : [],
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
module.exports = { createCourse, deleteCourse, showAllCourses, getCourseDetail, editCourse, getInstructorCourses, getFullCourseDetails }