import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
const HomePage = () => {
    return (
        <div>
            {/* section 1 */}
            <div className='relative mx-auto flex flex-col w-11/12 items-center justify-between text-white'>
                <Link to={'/signup'}>
                    <div className='p-1 m-16 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 w-fit hover:scale-95 transition-all duration-200 group'>
                        <div className='flex items-center gap-2 rounded-full px-10 py-[5px] group-hover:bg-richblack-900'>
                            <p>Become An Instructor</p>
                            <FaArrowRight />
                        </div>
                    </div>
                </Link>

            </div>
            {/* section 2 */}
            {/* section 3 */}

        </div>
    )
}

export default HomePage
