const Review = require("../model/Review");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../model/Bootcamp");

// @desc Get reviews
// @route GET/api/v1/reviews
// @route GET /api/bootcamp/:bootcampID/reviews

exports.getReviews = asyncHandler(async(req, res, next)=>{
    if(req.params.bootcampId){
        const reviews = await Review.find({bootcamp: req.params.bootcampId});
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    }else{
        res.status(200).json(res.advancedResult)
    }

})

// @desc Get reviews
// @route GET/api/v1/reviews/:id
// @access public

exports.getReview = asyncHandler(async(req, res, next)=>{
    
        const review = await Review.findById(req.params.id).populate({
            path: 'bootcamp',
            select: 'name description'
        })
        if(!review){
            return next(new ErrorResponse(`The review with the ${req.params.id} was not found`, 404))
        }
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: review
        })
});

exports.addReview = asyncHandler(async(req, res, next)=>{
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id
   const bootcamp =  await Bootcamp.findById(req.params.bootcampId);
   if(!bootcamp){
       return next(new ErrorResponse(`The bootcamp with the ${req.params.id} not found`, 404))
   }

  const review =  await Review.create(req.body);

   res.status(200).json({
    success: true,
    data: review
})

});

exports.updateReview = asyncHandler(async(req, res, next)=>{
    let review;
     review =  await Review.findById(req.params.id);
    if(!review){
        return next(new ErrorResponse(`The bootcamp with the ${req.params.id} not found`, 404))
    }
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
      return next(new ErrorResponse(`Not permitted to update the review`, 401))
    }
 
     review =  await Review.findByIdAndUpdate(req.params.id, req.body, {
         new:true,
         runValidators: true
     });
 
    res.status(200).json({
     success: true,
     data: {}
 })
 
 })

exports.deleteReview = asyncHandler(async(req, res, next)=>{
   const review =  await Review.findById(req.params.id);
   if(!review){
       return next(new ErrorResponse(`The bootcamp with the ${req.params.id} not found`, 404))
   }
   if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
     return next(new ErrorResponse(`Not permitted to delete the review`, 401))
   }

   await review.remove();

   res.status(200).json({
    success: true,
    data: {}
})

})