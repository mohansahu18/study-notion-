import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"
import { Navigate } from "react-router-dom"

import CourseReviewModal from "../core/view course/CourseReviewModal"
import VideoDetailsSidebar from "../core/view course/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../../services/operation/courseDetailsAPI"
import { ACCOUNT_TYPE } from "../../utils/constant"

import {
    setCompletedLectures,
    setCourseSectionData,
    setEntireCourseData,
    setTotalNoOfLectures,
} from "../../slice/viewCourseSlice"

export default function ViewCourse() {
    const { courseId } = useParams()
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((store) => store.profile)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [reviewModal, setReviewModal] = useState(false)

    useEffect(() => {
        if (
            user.accountType === ACCOUNT_TYPE.STUDENT
        ) {
            ; (async () => {
                setLoading(true)
                const courseData = await getFullDetailsOfCourse(courseId, token)
                setLoading(false)

                // console.log("Course Data here... ", courseData)
                dispatch(setCourseSectionData(courseData?.courseDetails?.courseContent))
                dispatch(setEntireCourseData(courseData?.courseDetails))
                dispatch(setCompletedLectures(courseData?.completedVideos))

                let lectures = 0
                courseData?.courseDetails?.courseContent?.forEach((sec) => {
                    lectures += sec.subSection.length
                })
                dispatch(setTotalNoOfLectures(lectures))
            })()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if (loading) {
        return (
            <div className="flex h-[calc(100vh)] w-full justify-center items-center">
                <div className="spinner"></div>
            </div>
        )
    }
    return (
        <>
            {
                user.accountType === ACCOUNT_TYPE.STUDENT ?
                    <>
                        <div className="relative flex md:flex-row flex-col-reverse min-h-[calc(100vh-3.5rem)]">
                            <VideoDetailsSidebar setReviewModal={setReviewModal} />
                            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                                <div className="mx-6">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                        {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
                    </>
                    :
                    <Navigate to={"/"} />
            }
        </>
    )
}