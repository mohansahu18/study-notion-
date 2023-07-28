const express = require("express")
const router = express.Router()
const { auth } = require("../middleware/auth")


const { updateProfile, deleteAccount, updateDisplayPicture } = require("../controllers/profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// routes of update the profile
router.put("/updateProfile", auth, updateProfile)
// routes of update display profile picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
// routes for delete the account
router.delete("/deleteAccount", auth, deleteAccount)

module.exports = router
