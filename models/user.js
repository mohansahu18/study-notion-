const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

        firstName: {
                type: String,
                required: true,
                trim: true
        },
        lastName: {
                type: String,
                required: true,
                trim: true
        },
        email: {
                type: String,
                required: true,
                trim: true
        },
        password: {
                type: String,
                required: true,
                trim: true
        },
        accountType: {
                type: String,
                required: true,
                enum: ['student', 'instructor', 'admin']
        },
        additionalDetails: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Profile",
                required: true
        },
        token: {
                type: String
        },
        resetPasswordExpires: {
                type: Date
        },
        courses: [
                {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Courses",
                }
        ],
        courseProgress: [
                {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "CourseProgress"
                }
        ]
})

module.exports = mongoose.model("User", userSchema)