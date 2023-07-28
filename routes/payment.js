// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment } = require("../controllers/Payments")
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment", verifyPayment)

module.exports = router
