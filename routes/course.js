// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
    createCourse,
    showAllCourses,
    getCourseDetail,
} = require("../controllers/Course")

// Categories Controllers Import
const {
    showAllCategory,
    createCategory,
    categoryPageDetails,
} = require("../controllers/Category")

// Sections Controllers Import
const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section")

// Sub-Sections Controllers Import
const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/Subsection")

// Rating Controllers Import
const {
    createRating,
    getAverageRating,
    getAllRatingAndReview,
} = require("../controllers/RatingAndReview")

const {
    updateCourseProgress
} = require("../controllers/courseProgress");

// Importing Middleware
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
// Get all Registered Courses
router.get("/getAllCourses", showAllCourses)
// get all course detail
router.get("/courseDetail", getCourseDetail)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.put("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.delete("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.put("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)

router.put("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategory)
router.get("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingAndReview)

module.exports = router