/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */

const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAll = (Model) => {
    return catchAsync(async (req, res) => {
        //Only for Nested GET reviews on tour
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };

        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        //execute query on the last
        const doc = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: "success",
            results: doc.length,
            data: {
                data: doc,
            },
        });
    });
};

exports.getOne = (Model, populateOpt) => {
    return catchAsync(async (req, res, next) => {
        //populate -> So as to show details of user in guides array in result

        let query;
        query = Model.findById(req.params.id);
        if (populateOpt) query = query.populate(populateOpt);

        const doc = await query;
        // doc.findOne({ _id: req.params.id })

        if (!doc) {
            return next(new AppError("No document found with that ID", 404));
        }

        res.status(200).json({
            status: "success",
            data: {
                data: doc,
            },
        });
    });
};

exports.createOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        const newDoc = await Model.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                data: newDoc,
            },
        });
    });
};

exports.deleteOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(new AppError("No document found with that ID", 404));
        }

        res.status(204).json({
            status: "success",
            data: null,
        });
    });
};

exports.updateOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!doc) {
            return next(new AppError("No document found with that ID", 404));
        }

        res.status(200).json({
            status: "success",
            data: {
                data: doc,
            },
        });
    });
};
