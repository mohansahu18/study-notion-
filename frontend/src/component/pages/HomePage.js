import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import HighlightText from '../core/homepage/HighlightText'
import CTAButton from '../core/homepage/Button'
import BannerVideo from '../../assets/Images/banner.mp4'
import CodeBlocks from '../core/homepage/CodeBlocks'
const HomePage = () => {
    return (
        <div>
            {/* section 1 */}

            {/* Become a Instructor Button */}
            <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center justify-between text-white'>
                <Link to={'/signup'}>
                    <div className='p-1 mt-16 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 w-fit hover:scale-95 transition-all duration-200 group'>
                        <div className='flex items-center gap-2 rounded-full px-10 py-[5px] group-hover:bg-richblack-900'>
                            <p>Become An Instructor</p>
                            <FaArrowRight />
                        </div>
                    </div>
                </Link>

                {/* Heading */}
                <div className='text-center text-4xl font-semibold mt-7'>
                    Empower Your Future with
                    <HighlightText text={' Coding Skills'} />
                </div>

                {/* sub heading */}
                <div className=' mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                </div>

                {/* CTA button */}
                <div className='flex flex-row gap-7 mt-8'>
                    <CTAButton active={true} linkTo={'/signup'} >
                        Learn More
                    </CTAButton>
                    <CTAButton active={false} linkTo={'/signup'} >
                        Book A Demo
                    </CTAButton>
                </div>

                {/* Banner video */}
                <div className='mx-3 my-12 shadow-blue-200'>
                    <video
                        muted
                        loop
                        autoPlay
                    >
                        <source src={BannerVideo} type="video/mp4" />
                    </video>
                </div>

                {/* Code Section 1  */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row"}
                        heading={
                            <div className="text-4xl font-semibold">
                                Unlock your {' '}
                                <HighlightText text={"coding potential"} /> with our online
                                courses.
                            </div>
                        }
                        subheading={
                            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                        }
                        ctabtn1={{
                            btnText: "Try it Yourself",
                            link: "/signup",
                            active: true,
                        }}
                        ctabtn2={{
                            btnText: "Learn More",
                            link: "/signup",
                            active: false,
                        }}
                        codeColor={"text-yellow-25"}
                        codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>Mohan Welcomes You</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                        backgroundGradient={<div className="codeblock1 absolute"></div>}

                    />

                </div>

                {/* Code Section 2 */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row-reverse"}
                        heading={
                            <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                                Start {" "}
                                <HighlightText text={"coding in seconds"} />
                            </div>
                        }
                        subheading={
                            "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                        }
                        ctabtn1={{
                            btnText: "Continue Lesson",
                            link: "/signup",
                            active: true,
                        }}
                        ctabtn2={{
                            btnText: "Learn More",
                            link: "/signup",
                            active: false,
                        }}
                        codeColor={"text-white"}
                        codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                        backgroundGradient={<div className="codeblock2 absolute"></div>}
                    />
                </div>



            </div>
            {/* section 2 */}
            {/* section 3 */}

        </div>
    )
}

export default HomePage
