import { configureStore } from "@reduxjs/toolkit"
// import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slice/authSlice"
import profileSlice from "../slice/profileSlice"
import cartSlice from "../slice/cartSlice"

const store = configureStore(
    {
        reducer: {
            auth: authSlice,
            profile: profileSlice,
            cart: cartSlice
        }
    }
)

export default store