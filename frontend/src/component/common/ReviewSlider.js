import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, FreeMode } from 'swiper/modules'

import React, { useEffect, useState, useRef } from 'react';
import { ratingsEndpoints } from '../../services/api'
import { apiConnector } from '../../services/apiConnector'
import RatingStars from '../common/RatingStars'


const RatingSlider = () => {
    const [Reviews, setReviews] = useState([]);
    const [Loading, setLoading] = useState(true);

    useEffect(() => {
        const getReviews = async () => {
            setLoading(true);
            try {
                const res = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API);
                setReviews(res.data.data);
                console.log("LOGGING REVIEWS", res);
            } catch (error) {
                console.log("LOGGING Review ERROR", error);
            } finally {
                setLoading(false);
            }
        }
        getReviews();
    }, [])
    return (
        <div className=' w-full' >
            <Swiper
                slidesPerView={1}
                spaceBetween={20}
                centeredSlides={true}
                loop={true}
                pagination={true}
                autoplay={{
                    delay: 1500,
                    // disableOnInteraction: false,
                }}
                modules={[Pagination, Autoplay]}
                breakpoints={{
                    1024: {
                        slidesPerView: 4,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                    640: {
                        slidesPerView: 1,
                        // spaceBetween: 20,
                    },
                }}
                className="max-h-[30rem] text-white"

            >
                {/* {console.log("Review are  : ->", Reviews)} */}
                {
                    Reviews?.map((review, index) => (
                        <SwiperSlide
                            key={index}
                        >
                            <div className='w-60 flex flex-col gap-3 min-h-[150px] bg-richblack-800 p-3 text-[14px] text-richblack-25'>
                                <div className='flex items-center gap-4'>
                                    <img src={review?.user?.image} alt="user" className='h-9 w-9 rounded-full object-cover' />
                                    <div className='flex flex-col'>
                                        <h3 className='font-semibold text-richblack-5'>{review?.user?.firstName} {review?.user.lastName}</h3>
                                        <p className='text-[12px] font-medium text-richblack-500'>{review?.course?.courseName}</p>
                                    </div>
                                </div>
                                <div className='font-medium text-richblack-25'>{review?.review.slice(0, 70)}...</div>
                                <RatingStars Review_Count={review?.rating} />
                            </div>
                        </SwiperSlide>
                    ))
                }
                <div className='swiper-button-next'></div>
                <div className='swiper-button-prev'></div>
            </Swiper>
        </div>
    )
}

export default RatingSlider