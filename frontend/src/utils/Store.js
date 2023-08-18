import { configureStore } from "@reduxjs/toolkit"
// import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slice/authSlice"
import profileSlice from "../slice/profileSlice"
import cartSlice from "../slice/cartSlice"
import viewCourseSlice from "../slice/viewCourseSlice"
import courseSlice from "../slice/courseSlice"

const store = configureStore(
    {
        reducer: {
            auth: authSlice,
            profile: profileSlice,
            cart: cartSlice,
            viewCourse: viewCourseSlice,
            course: courseSlice
        }
    }
)

export default store