import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null
}

const authSlice = createSlice(
    {
        name: 'auth',
        initialState: initialState,
        reducers: {
            setToken: (state, action) => {
                state.token = action.payload
            }
        }

    }
)

export default authSlice.reducer
export const { setToken } = authSlice.actions