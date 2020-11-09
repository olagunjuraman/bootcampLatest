const express = require('express');
const { getReviews,getReview,addReview, updateReview, deleteReview} = require('../controller/review');
const Review = require('../model/Review');

const router = express.Router({mergeParams: true});

const advancedResult = require('../middlewares/advancedResults');
const {protect, authorize} = require('../middlewares/auth')

router.route('/').get(advancedResult(Review, {
    path: 'bootcamp',
    select: 'name description'
}), getReviews).post(protect, authorize('user', 'admin'), addReview)

router.route('/:id').get(getReview).put(protect, authorize('user', 'admin'), updateReview).delete(protect, authorize('user', 'admin'), deleteReview)


module.exports = router