const express = require("express")
const router = express.Router()

const { updateProfile, deleteAccount } = require("../controllers/profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// routes of update the profile
router.put("/updateProfile", updateProfile)
// routes for delete the account
router.delete("/deleteAccount", deleteAccount)

module.exports = router
