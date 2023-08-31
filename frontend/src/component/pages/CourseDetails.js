import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { toast } from "react-hot-toast"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import { ACCOUNT_TYPE } from "../../utils/constant"
import ConfirmationModal from "../common/ConfirmationModal"
import RatingStars from "../common/RatingStars"
import CourseAccordionBar from "../core/course/CourseAccordionBar"
import CourseDetailsCard from "../core/course/CourseDetailsCard"
import { formatDate } from "../../services/formatDate"
import { fetchCourseDetails } from "../../services/operation/courseDetailsAPI"
import { BuyCourse } from "../../services/operation/studentFeaturesAPI"
import GetAvgRating from "../../utils/avgRating"
import Error from "../pages/ErrorPage"
import { addToCart } from '../../slice/cartSlice'

function CourseDetails() {
    const { user } = useSelector((state) => state.profile)
    const { token } = useSelector((state) => state.auth)
    // const { loading } = useSelector((state) => state.profile)
    const { paymentLoading } = useSelector((state) => state.course)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Getting courseId from url parameter
    const { courseId } = useParams()
    console.log(`course id: ${courseId}`)
    // Declare a state to save the course details
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(false)
    const [confirmationModal, setConfirmationModal] = useState(null)
    useEffect(() => {
        // Calling fetchCourseDetails function to fetch the details
        // console.log("calling api ............");
        ; (async () => {
            try {
                // console.log("calling api try block ............");

                setLoading(true)
                const res = await fetchCourseDetails(courseId)
                setLoading(false)
                // console.log("course details res: ", res)
                setResponse(res)
                // console.log("calling api try block end............");

            } catch (error) {
                // console.log("calling api error in ctch block............");
                console.log(error);
                console.log("Could not fetch Course Details")
            }
        })()
    }, [courseId])

    // console.log("response: ", response)

    // Calculating Avg Review count
    const [avgReviewCount, setAvgReviewCount] = useState(0)
    useEffect(() => {
        const count = GetAvgRating(response?.data?.courseDetail[0]?.ratingAndReview)
        setAvgReviewCount(count)
    }, [response])
    // console.log("avgReviewCount: ", avgReviewCount)

    // // Collapse all
    // const [collapse, setCollapse] = useState("")
    const [isActive, setIsActive] = useState(Array(0))
    const handleActive = (id) => {
        // console.log("called", id)
        setIsActive(
            !isActive.includes(id)
                ? isActive.concat([id])
                : isActive.filter((e) => e !== id)
        )
    }

    // Total number of lectures
    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
    useEffect(() => {
        let lectures = 0
        response?.data?.courseDetail[0]?.courseContent?.forEach((sec) => {
            lectures += sec.subSection.length || 0
        })
        setTotalNoOfLectures(lectures)
    }, [response])

    if (loading || !response) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        )
    }
    if (!response.success) {
        return <Error />
    }
    console.log("response : - >", response);
    const {
        _id: course_id,
        courseName,
        courseDescription,
        thumbnail,
        price,
        whatYouWillLearn,
        courseContent,
        ratingAndReview,
        instructor,
        studentEnroll,
        createdAt,
    } = response.data?.courseDetail[0]

    const handleBuyCourse = () => {
        if (token) {
            BuyCourse(token, [courseId], user, navigate, dispatch)
            return
        }
        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to Purchase Course.",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
        })
    }

    const handleAddToCart = () => {
        if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
            toast.error("You are an Instructor. You can't buy a course.")
            return
        }
        if (token) {
            console.log(thumbnail, price, courseId);
            dispatch(addToCart(response.data?.courseDetail[0]))
            return
        }
        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to add To Cart",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
        })
    }

    if (paymentLoading) {
        // console.log("payment loading")
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <>
            <div className={`relative w-full bg-richblack-800`}>
                {/* Hero Section */}
                <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
                    <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
                        <div className="relative block max-h-[30rem] lg:hidden">
                            <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
                            <img
                                src={thumbnail}
                                alt="course thumbnail"
                                className="aspect-auto w-full"
                            />
                        </div>
                        <div
                            className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
                        >
                            <div>
                                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                                    {courseName}
                                </p>
                            </div>
                            <p className={`text-richblack-200`}>{courseDescription}</p>
                            <div className="text-md flex flex-wrap items-center gap-2">
                                <span className="text-yellow-25">{avgReviewCount}</span>
                                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                                <span>{`(${ratingAndReview?.length} reviews)`}</span>
                                <span>{`${studentEnroll?.length} students enrolled`}</span>
                            </div>
                            <div>
                                <p className="">
                                    Created By {`${instructor?.firstName} ${instructor?.lastName}`}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-5 text-lg">
                                <p className="flex items-center gap-2">
                                    {" "}
                                    <BiInfoCircle /> Created at {formatDate(createdAt)}
                                </p>
                                <p className="flex items-center gap-2">
                                    {" "}
                                    <HiOutlineGlobeAlt /> English
                                </p>
                            </div>
                        </div>
                        <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
                            <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                                Rs. {price}
                            </p>
                            {/* <button className="yellowButton" onClick={handleBuyCourse}>
                                Buy Now
                            </button>
                            <button className="blackButton">Add to Cart</button> */}
                            <button
                                className="yellowButton"
                                onClick={
                                    user && response?.data?.courseDetail[0]?.studentEnroll?.includes(user?._id)
                                        ? () => navigate("/dashboard/enrolled-courses")
                                        : handleBuyCourse
                                }
                            >
                                {user && response?.data?.courseDetail[0]?.studentEnroll?.includes(user?._id)
                                    ? "Go To Course"
                                    : "Buy Now"}
                            </button>
                            {(!user || !response?.data?.courseDetail[0]?.studentEnroll?.includes(user?._id)) && (
                                <button onClick={handleAddToCart} className="blackButton">
                                    Add to Cart
                                </button>
                            )}

                        </div>
                    </div>
                    {/* Courses Card */}
                    <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
                        {/* {console.log("response : - >", response)} */}
                        <CourseDetailsCard
                            course={response?.data?.courseDetail[0]}
                            setConfirmationModal={setConfirmationModal}
                            handleBuyCourse={handleBuyCourse}
                        />
                    </div>
                </div>
            </div >
            <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
                <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
                    {/* What will you learn section */}
                    <div className="my-8 border border-richblack-600 p-8">
                        <p className="text-3xl font-semibold">What you'll learn</p>
                        <div className="mt-5">
                            <ReactMarkdown>{whatYouWillLearn}</ReactMarkdown>
                        </div>
                    </div>

                    {/* Course Content Section */}
                    <div className="max-w-[830px] ">
                        <div className="flex flex-col gap-3">
                            <p className="text-[28px] font-semibold">Course Content</p>
                            <div className="flex flex-wrap justify-between gap-2">
                                <div className="flex gap-2">
                                    <span>
                                        {courseContent?.length} {`section(s)`}
                                    </span>
                                    <span>
                                        {totalNoOfLectures} {`lecture(s)`}
                                    </span>
                                    {/* <span>{response.data.totalDuration} total length</span> */}
                                </div>
                                <div>
                                    <button
                                        className="text-yellow-25"
                                        onClick={() => setIsActive([])}
                                    >
                                        Collapse all sections
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Course Details Accordion */}
                        <div className="py-4">
                            {courseContent?.map((course, index) => (
                                <CourseAccordionBar
                                    course={course}
                                    key={index}
                                    isActive={isActive}
                                    handleActive={handleActive}
                                />
                            ))}
                        </div>

                        {/* Author Details */}
                        <div className="mb-12 py-4">
                            <p className="text-[28px] font-semibold">Author</p>
                            <div className="flex items-center gap-4 py-4">
                                <img
                                    src={
                                        instructor?.image
                                            ? instructor?.image
                                            : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor?.firstName} ${instructor?.lastName}`
                                    }
                                    alt="Author"
                                    className="h-14 w-14 rounded-full object-cover"
                                />
                                <p className="text-lg">{`${instructor?.firstName} ${instructor?.lastName}`}</p>
                            </div>
                            <p className="text-richblack-50">
                                {instructor?.additionalDetails?.about}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </>
    )
}

export default CourseDetails













