import React, { useEffect, useState } from 'react'
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const Course_Card = ({ course, Height }) => {


    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(() => {
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    }, [course])



    return (
        <>
            {/* {console.log("course card : - >", course)}; */}
            <Link to={`/courses/${course._id}`}>
                <div className=" w-11/12 h-3/6">
                    <div className="rounded-lg">
                        <img
                            src={course?.thumbnail}
                            alt="course thumbnail"
                            className={`h-44 md:h-64 w-full rounded-xl object-cover `}
                        />
                    </div>
                    <div className="flex flex-col gap-2 px-1 py-3">
                        <p className="text-xl text-richblack-5">{course?.courseName}</p>
                        <div className='flex gap-3 items-center'>
                            <img className='h-10 w-10 rounded-full' src={course?.instructor?.image} alt='instructor img' />
                            <p className="text-sm text-richblack-50">
                                {course?.instructor?.firstName} {course?.instructor?.lastName}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-yellow-5">{avgReviewCount || 0}</span>
                            <RatingStars Review_Count={avgReviewCount} />
                            <span className="text-richblack-400">
                                {course?.ratingAndReviews?.length} Ratings
                            </span>
                        </div>
                        <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default Course_Card
