const mongoose = require("mongoose")

const ratingAndReview = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true,
        trim: true
    }
})

module.exports = mongoose.model("RatingAndReview", ratingAndReview)    