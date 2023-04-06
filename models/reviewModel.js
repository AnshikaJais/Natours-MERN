/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable new-cap */
/* eslint-disable prettier/prettier */
const { Schema, model, default: mongoose } = require("mongoose");
const Tour = require("./tourModel");
const User = require("./userModel");

const reviewSchema = new Schema(
    {
        review: {
            type: String,
            required: [true, "A review is mandatory"],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            set: (val) => Math.round(val * 10) / 10,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: User,
            required: [true, "A Review must belong to a user."],
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: Tour,
            required: [true, "A Review must belong to a tour."],
        },
    },
    {
        toJSON: { virtual: true },
        toObject: { virtual: true },
    }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    //   this.populate({
    //     path: 'tour',
    //     select: ['name'],
    //   });
    this.populate({
        path: "user",
        select: ["name", "photo"],
    });
    next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const states = await this.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: "$tour",
                nRatings: { $sum: 1 },
                avgRating: { $avg: "$rating" },
            },
        },
    ]);
    console.log(states);
    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: states[0].nRatings,
        ratingsAverage: states[1].avgRating,
    });
};

reviewSchema.post("save", function () {
    //this.constructor = Model itself
    this.constructor.calcAverageRatings(this.tour);
});

const Review = new model("Review", reviewSchema);

module.exports = Review;
