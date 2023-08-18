import React, { useEffect, useState } from 'react'
import { Link, useLocation, matchPath } from 'react-router-dom'
import logo from '../../assets/Logo/Logo-Full-Light.png'
import { NavbarLinks } from '../../data/navbar-links'
import { useSelector } from 'react-redux'
import { ACCOUNT_TYPE } from '../../utils/constant'
import ProfileDropdown from '../core/auth/ProfileDropdown'
import { AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from 'react-icons/bs'
import { apiConnector } from '../../services/apiConnector'
import { courseEndpoints } from '../../services/api'


const Header = () => {
    const { token } = useSelector((store) => store.auth)
    const { user } = useSelector((store) => store.profile)
    const { totalItems } = useSelector((store) => store.cart)

    const [subLinks, setSubLinks] = useState([])

    const fetchSubLinks = async () => {
        try {
            const result = await apiConnector("GET", courseEndpoints.COURSE_CATEGORIES_API)
            // console.log("result:", JSON.stringify(result.data.data, null, 2));
            setSubLinks(result.data.data)
            // console.log("subLinks", subLinks);
        } catch (err) {
            console.log(`error while fetching subLinks : - > ${err}`);
        }
    }
    useEffect(() => {
        fetchSubLinks()
    }, [])

    const location = useLocation()
    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname)
    }
    return (
        <div
            className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700  transition-all duration-200`}>
            <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
                {/* logo */}
                <Link>
                    <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
                </Link>

                {/* nav links */}
                <nav>
                    <ul className='flex gap-x-6 text-richblack-25'>
                        {NavbarLinks.map((element, index) => (
                            <li key={index}>
                                {element.title === 'Catalog' ? (
                                    <div className='flex items-center gap-1 group'>
                                        <p>
                                            {element.title}
                                        </p>
                                        <BsChevronDown />
                                        <div className="invisible absolute left-[45%] top-[5%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                            <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5">
                                            </div>
                                            {
                                                subLinks.length ? (
                                                    <>
                                                        {subLinks
                                                            ?.map((subLink, i) => (
                                                                <Link
                                                                    to={`/catalog/${subLink.name
                                                                        .split(" ")
                                                                        .join("-")
                                                                        .toLowerCase()}`}
                                                                    className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                                    key={i}
                                                                >
                                                                    <p>{subLink.name}</p>
                                                                </Link>
                                                            ))}
                                                    </>
                                                ) : (
                                                    <p className="text-center">No Courses Found</p>
                                                )
                                            }

                                        </div>
                                    </div>
                                ) : (
                                    <Link to={element.path}>
                                        <p className={`${matchRoute(element.path) ? "text-yellow-50" : "ring-richblack-50"}`}>
                                            {element?.title}
                                        </p>
                                    </Link>)
                                }
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* login / signup / dashboard  */}
                <div className=" items-center gap-x-4 md:flex">
                    {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                        <Link to="/dashboard/cart" className="relative">
                            <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                            {totalItems > 0 && (
                                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}
                    {
                        token === null && (
                            <>
                                <Link to="/login">
                                    <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                        Log in
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                        Sign up
                                    </button>
                                </Link>
                            </>
                        )
                    }

                    {token !== null && <ProfileDropdown />}
                </div>

            </div>
        </div >
    )
}

export default Header
