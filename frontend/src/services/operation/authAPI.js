import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slice/authSlice"
// import { resetCart } from "../../slice/cartSlice"
// import { setUser } from "../../slice/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../api"

const {
    SENDOTP_API,
    SIGNUP_API,
    // LOGIN_API,
    // RESETPASSTOKEN_API,
    // RESETPASSWORD_API,
} = endpoints

console.log("send otp api url: -|>", SENDOTP_API);
const sendOtp = (email, navigate) => {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        console.log("tost id : - >", toastId);
        dispatch(setLoading(true))
        try {
            console.log("email : - >", email);
            const response = await apiConnector("POST", SENDOTP_API, {
                email,
                checkUserPresent: true,
            })
            console.log("SENDOTP API RESPONSE............", response)
            console.log(response.data.success)
            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("OTP Sent Successfully")
            navigate("/verify-email")
        } catch (error) {
            console.log("SENDOTP API ERROR............", error)
            toast.error("Could Not Send OTP")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

const signUp = (
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
) => {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        console.log("signup tost id", toastId);
        dispatch(setLoading(true))
        try {
            console.log("signup details", accountType, firstName, lastName, email, password, confirmPassword, otp);
            const response = await apiConnector("POST", "http://localhost:4000/api/v1/auth/signup", {
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp,
            })

            console.log("SIGNUP API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Signup Successful")
            navigate("/login")
        } catch (error) {
            console.log("SIGNUP API ERROR............", error)
            toast.error("Signup Failed")
            navigate("/signup")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}
export { sendOtp, signUp }