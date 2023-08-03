import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
    totalItems: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("user")) : 0,
}

const cartSlice = createSlice(
    {
        name: 'cart',
        initialState: initialState,
        reducers: {
            setTotalItems(state, action) {
                state.totalItems = action.payload;
            },
        }

    }
)

export default cartSlice.reducer
export const { setTotalItems } = cartSlice.actions