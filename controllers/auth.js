const User = require("../models/user")
const Profile = require("../models/profile")
const Otp = require("../models/otp")
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const mailSender = require("../utils/mailSender")
require("dotenv").config()

// otp generator
const sendOtp = async (req, res) => {
    try {
        // fetch email
        const { email } = req.body

        // check if user is already exits
        const checkUserPresent = await User.findOne({ email })

        // if user already exit , return response
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "user already registered"
            })
        }

        // generate otp
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        console.log(`generated otp are  : - > ${otp}`);

        // check unique otp or not
        let result = await Otp.findOne({ otp: otp })
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            const result = await Otp.findOne({ otp: otp })
        }
        const otpPayload = { email, otp }

        // create an entry in db
        const otpBody = await Otp.create(otpPayload)

        // return success response
        return res.status(200).json({
            success: true,
            message: "otp sent successfully",
            data: otpBody
        })
    } catch (err) {

        console.log(`not able to generate otp  ${err}`)
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

// signup
const signup = async (req, res) => {
    try {

        // fetch data from req body
        const {
            firstName,
            lastName,
            email,
            password,
            accountType,
            confirmPassword,
            contactNumber,
            otp } = req.body
        // validate
        if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber) {
            return res.status(403).json({
                success: false,
                message: "please fill all the fields"
            })
        }
        // check user is already registered or not
        const exitingUser = await User.findOne({ email })
        if (exitingUser) {
            return res.status(400).json({
                success: false,
                message: "user already registered"
            })
        }
        // verify the password and confirm password
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password and confirm password value does not match"
            })
        }
        // find most resent otp stored for the user 
        const resentOtp = await User.find({ email }).sort({ createdAt: -1 }).limit(1)
        // validate otp 
        if (resentOtp.length === 0) {
            return res.status(400).json({
                success: false,
                message: "otp not found"
            })
        } else if (otp != resentOtp.otp) {
            return res.status(400).json({
                success: false,
                message: "invalid otp"
            })
        }
        // hash the password 
        const hashedPassword = await bcrypt.hash(password, 10)
        // save the entry in the db
        const profileDetail = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: contactNumber,
        })
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetail._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })
        // return response
        return res.status(200).json({
            success: true,
            message: "user created successfully",
            data: user
        })

    } catch (err) {
        console.log(`not able to signup ${err}`);
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// login
const login = async (req, res) => {
    try {
        // fetch data 
        const { email, password } = req.body

        // validate data 
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "please fill all the fields"
            })

        }

        // check user exit or not 
        const user = await User.findOne({ email }).populate("additionalDetails")
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user is not registered"
            })
        }

        // generate token after verifying the password
        if (await bcrypt.compare(password, User.password)) {
            const payload = {
                id: user._id,
                email: user.email,
                accountType: user.accountType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2h'
            })
            user.token = token
            user.password = undefined
            // return success response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            return res.cookie("token", token, options).status(200).json({
                success: true,
                message: "login successfully",
                data: user,
                token: token
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "incorrect password"
            })
        }
    } catch (err) {
        console.log(`not able to login ${err}`);
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// change password
const changePassword = async (req, res) => {
    try {
        // get old password new password and confirm password
        const { oldPassword, newPassword, confirmPassword } = req.body
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "please fill all the fields"
            })
        }

        // validate
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password and confirm password value does not match"
            })
        }

        // Check if the old password matches the current password in the database
        const user = await User.findOne({ email: req.user.email });
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        // update password in db
        hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await User.save();
        // send mail password updated 
        mailSender(user.email, "password updated", "your password changed successfully")

        // success response
        return res.status(200).json({
            success: true,
            message: "password changed successfully"
        })
    } catch (err) {
        console.log(`not able to change a password ${err}`);
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = { sendOtp, signup, login, changePassword }