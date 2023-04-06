/* eslint-disable prettier/prettier */

const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

//By default, each route has access to the parameters of their specific routes, so to merge two parameters { mergeParams: true } is required.

const router = express.Router({ mergeParams: true });
//Thus, this would merge '/:tourId/reviews' and '/' routes.
//So, even '/' route is being called, tourId is also accessible.

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
