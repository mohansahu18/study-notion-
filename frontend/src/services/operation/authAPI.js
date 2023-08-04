import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slice/authSlice"
// import { resetCart } from "../../slice/cartSlice"
// import { setUser } from "../../slice/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../api"

const {
    SENDOTP_API,
    // SIGNUP_API,
    // LOGIN_API,
    // RESETPASSTOKEN_API,
    // RESETPASSWORD_API,
} = endpoints
function sendOtp(email, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
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
export { sendOtp }