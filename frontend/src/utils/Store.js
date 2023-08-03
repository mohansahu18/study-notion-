import { configureStore } from "@reduxjs/toolkit"
// import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slice/authSlice"

const store = configureStore(
    {
        reducer: {
            auth: authSlice
        }
    }
)

export default store