import React from 'react'
import TimeLineImage from '../../../assets/Images/TimelineImage.png'
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg'
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg'

const TimeLine = [
    {
        Logo: Logo1,
        Heading: "Leadership",
        Description: "Fully committed to the success company",
    },
    {
        Logo: Logo2,
        Heading: "Responsibility",
        Description: "Students will always be our top priority",
    },
    {
        Logo: Logo3,
        Heading: "Flexibility",
        Description: "The ability to switch is an important skills",
    },
    {
        Logo: Logo4,
        Heading: "Solve the problem",
        Description: "Code your way to a solution",
    },
];

const TimelineSection = () => {
    return (
        <div>
            <div>
                <div className="flex flex-col lg:flex-row gap-20 mb-20 items-center">
                    <div className="lg:w-[45%] flex flex-col gap-14 lg:gap-3">
                        {TimeLine.map((element, index) => {
                            return (
                                <div className="flex flex-col lg:gap-3" key={index}>
                                    <div className="flex gap-6" key={index}>
                                        <div className="w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]">
                                            <img src={element.Logo} alt="" />
                                        </div>
                                        <div>
                                            <h2 className="font-semibold text-[18px]">{element.Heading}</h2>
                                            <p className="text-base">{element.Description}</p>
                                        </div>
                                    </div>
                                    <div
                                        className={`hidden ${TimeLine.length - 1 === index ? "hidden" : "lg:block"
                                            }  h-14 border-dotted border-r border-richblack-100 bg-richblack-400/0 w-[26px]`}
                                    ></div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="relative w-fit h-fit flex flex-col-reverse shadow-blue-200 shadow-[0px_0px_30px_0px]">
                        <div className="absolute flex flex-col  mx-auto sm:flex-row w-11/12 sm:w-4/5 sm:p-7  gap-4   bg-[#014A32] sm:top-96 top-80 left-3 sm:left-14 ">
                            {/* part 1 */}
                            <div className='flex items-center sm:gap-4 gap-2  justify-center sm:justify-between text-left border-r-2 border-white w-full sm:w-3/6'>
                                <p className=' text-white font-bold text-2xl sm:text-4xl'>10</p>
                                <p className='  text-caribbeangreen-300'>YEARS EXPERIENCES</p>
                            </div>

                            {/* part 2 */}
                            <div className="flex items-center gap-2 sm:gap-4 justify-center  sm:justify-between text-left w-full sm:w-3/6 ">
                                <p className='font-bold  text-2xl sm:text-4xl  text-white' >250</p>
                                <p className='text-caribbeangreen-300'>TYPES OF COURSES</p>

                            </div>
                            <div></div>
                        </div>
                        <img
                            src={TimeLineImage}
                            alt="timelineImage"
                            className="shadow-white shadow-[20px_20px_0px_0px] object-cover h-[400px] lg:h-fit"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TimelineSection
