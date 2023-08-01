import React from 'react'
import { Link } from 'react-router-dom'
const Button = ({ children, active, linkTo }) => {
    return (
        <Link to={linkTo}>
            <button className={`text-center text-[13px] px-6 py-3 rounded-md font-bold hover:scale-95 transition-all duration-200 ${active ? 'bg-yellow-50 text-black' : 'bg-richblack-800 text-white'} `} >
                {children}
            </button>
        </Link >
    )
}


export default Button
