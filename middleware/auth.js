const jwt = require("jsonwebtoken")
require("dotenv").config()

// auth
const auth = async (req, res, next) => {
    try {
        // extract token
        const token = req.cookie.token || req.body.token || req.header("Authorization").replace("Bearer", "")

        // if token missing , then return response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token is missing"
            })
        }

        // verify token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            console.log(`decode : - > ${decode}`);
            req.user = decode
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "token is invalid"
            })
        }
        next()
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: "something went wrong while validating token"
        })
    }
}

// is student
const isStudent = async (req, res, next) => {
    try {
        const user = req.user
        if (user.accountType === "student") {
            next()
        } else {
            return res.status(403).json({
                success: false,
                message: "you are not a student"
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: "user role cannot be verified"
        })
    }
}

// is instructor
const isInstructor = (req, res, next) => {
    try {
        const user = req.user
        if (user.accountType === "instructor") {
            next()
        } else {
            return res.status(403).json({
                success: false,
                message: "you are not an instructor"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "user role cannot be verified"
        })
    }
}

// is admin

module.exports = { auth, isStudent, isInstructor }