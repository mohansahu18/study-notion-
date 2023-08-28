import React from "react"

import ContactDetails from "../core/contactPage/ContactDetails"
import ContactForm from "../core/contactPage/ContactForm"
import ReviewSlider from "../common/ReviewSlider"

const Contact = () => {
    return (
        <div>
            <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
                {/* Contact Details */}
                <div className="lg:w-[40%]">
                    <ContactDetails />
                </div>

                {/* Contact Form */}
                <div className="lg:w-[60%]">
                    <ContactForm />
                </div>
            </div>
            <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                {/* Reviws from Other Learner */}
                <h1 className="text-center text-4xl font-semibold mt-8">
                    Reviews from other learners
                </h1>
                <ReviewSlider />
            </div>
        </div>
    )
}

export default Contact