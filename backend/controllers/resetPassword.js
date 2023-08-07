const { log } = require("console")
const User = require("../models/user")
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
require("dotenv").config()

const FRONTEND_URL = process.env.FRONTEND_URL
console.log("frontend url : - > ", FRONTEND_URL);
const resetPasswordToken = async (req, res) => {
    try {
        //fetch email
        const email = req.body.email

        // validate email
        if (!email) {
            return res.status(403).json({
                success: false,
                message: "please fill all the fields"
            })
        }

        // validate user
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user is not registered"
            })
        }

        // generate token
        const token = crypto.randomUUID()

        // update user by adding token and expiration date
        const updateDetails = await User.findOneAndUpdate({ email: email }, {
            token: token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000
        }, { new: true })

        // create url
        const url = `${FRONTEND_URL}/update-password/${token}`
        console.log("url send to mail : - >", url);

        // send mail containing url
        await mailSender(email, "reset password", `password reset link : ${url}`)

        // return success response
        return res.status(200).json({
            success: true,
            message: "email send successfully please check and reset password"
        })
    } catch (error) {
        console.log(`issue with reset password token: - > ${error}`);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        // fetch data
        const { token, password, confirmPassword } = req.body

        // validate
        if (password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "password and confirm password does not match"
            })
        }

        // get user detail from database
        const userDetails = await User.findOne({ token })

        // token verify
        if (!userDetails) {
            return res.status(403).json({
                success: false,
                message: "token is invalid"
            })
        }

        // time to check token
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(403).json({
                success: false,
                message: "token is expired"
            })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // update password
        await User.findOneAndUpdate({ token }, {
            password: hashedPassword
        },
            { new: true }
        )

        // return success response
        return res.status(200).json({
            success: true,
            message: "password updated successfully"
        })

    } catch (err) {
        console.log(`issue with reset password : - > ${err}`);
        return res.status(500).json({
            success: false,
            message: err.message
        })

    }
}

module.exports = { resetPasswordToken, resetPassword }