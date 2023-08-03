import React from 'react'
// return matchPath({ path: route }, useParams.pathname)
import { Link, useLocation, matchPath } from 'react-router-dom'
import logo from '../../assets/Logo/Logo-Full-Light.png'
import { NavbarLinks } from '../../data/navbar-links'
const Header = () => {
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
                                {element.title === 'Catalog' ? <div></div> :
                                    <Link to={element.path}>
                                        <p className={`${matchRoute(element.path) ? "text-yellow-50" : "ring-richblack-50"}`}>
                                            {element?.title}
                                        </p>
                                    </Link>}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* login / signup / dashboard  */}

            </div>
        </div>
    )
}

export default Header
