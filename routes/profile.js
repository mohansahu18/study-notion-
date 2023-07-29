const express = require("express")
const router = express.Router()
const { auth } = require("../middleware/auth")


const { updateProfile, deleteAccount, updateDisplayPicture, getAllUserDetails } = require("../controllers/profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// routes for getting all the user information for particular user
router.get("/getUserDetails", auth, getAllUserDetails)
// routes of update the profile
router.put("/updateProfile", auth, updateProfile)
// routes of update display profile picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
// routes for delete the account
router.delete("/deleteAccount", auth, deleteAccount)

module.exports = router
