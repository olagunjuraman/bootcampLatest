const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

const Bootcamp = require("../model/Bootcamp");
const geocoder = require("../utils/geocoder");
const User = require("../model/User");



exports.createBootCamp = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id
  console.log(req.body)
  //check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({user: req.user.id});
  if(publishedBootcamp && req.user.role !== 'admin'){
    return next(new ErrorResponse(`The user with the ID ${req.user.id} has already published a bootcamp`, 400));
  }
  const bootcamp = await Bootcamp.create(req.body);
  // console.log(bootcamp)
  if (!bootcamp)
    return next(new ErrorResponse("Bootcamp cannot be created", 400));
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

exports.getBootCamps = asyncHandler(async (req, res, next) => {
   res.status(200).json(res.advancedResult);
});

exports.getBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');
  if (!bootcamp)
    return next(
      new ErrorResponse(`The bootcamp with the ${req.params.id} not found`, 404)
    );
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});


exports.updateBootCamp = asyncHandler(async (req, res, next) => {
  let  bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp)
    return next(
      new ErrorResponse(`The bootcamp with the ${req.params.id} not found`, 404)
    );

    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
      return next(
        new ErrorResponse(`User ${req.user.id} is not authorized to delete this bootcamp`, 401)
      );
    }

    bootcamp = await Bootcamp.findbyIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

  return res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
 
  if (!bootcamp)
    return next(
      new ErrorResponse(`The bootcamp with the ${req.params.id} not found`, 404)
    );

    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
      return next(
        new ErrorResponse(`User ${req.user.id} is not authorized to delete this bootcamp`, 401)
      );
    }
    await bootcamp.remove();


  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

//@ desc Get Bootcamp in Radius
//@route GET api/v1/bootcamps/radius/:zipcode/:distance
exports.getBoootCampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //get lat/lng from geocoder
  const loc = geocoder.geocode(zipcode);
  const lat = loc[0].latitiude;
  const lng = loc[0].longitude;

  // calculate raduis using radians
  //Divide distance by radius of the earth
  //Earth Radius = 3,963miles/6,378km

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
