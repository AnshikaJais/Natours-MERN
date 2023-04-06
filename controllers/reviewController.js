/* eslint-disable prettier/prettier */
const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
// const catchAsync = require('../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  //if no tourId is there in parameter, i.e. '/' route is been called..
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
