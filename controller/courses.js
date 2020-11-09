const Courses = require("../model/Courses");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const BootCamp = require("../model/Bootcamp");

exports.getCourses = asyncHandler(async (req, res, next) => { 
  if(req.params.bootcampId){
    const courses  = Courses.find({bootcamp: req.params.bootcampId})
  }
  else{
    res.status(200).json(res.advancedResult);
  }
    
});

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name'
  })
  if (!course)
    return next(
      new ErrorResponse(
        `Course with the id ${req.params.id} was not found`,
        404
      )
    );
  res.status(200).json({
    success: true,
    data: course,
  });
});

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id

  const bootcamp = await BootCamp.findById(req.params.bootcampId);
  if (!bootcamp)
    return next(
      new errorResponse(`The bootcamp with the ${req.params.bootcampId}`, 404)
    );

  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(
      new errorResponse(`The User with the id  ${req.user.id} is not authorized to add a bootcamp id ${bootcamp._id}`, 401)
    );
  }

  const course = await Courses.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Courses.findById(req.params.id);

  if (!course)
    return next(
      new ErrorResponse(
        `Course with the id ${req.params.id} was not found`,
        404
      )
    );

    if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
      return next(
        new ErrorResponse(
          `User with the ${req.user.id} is not  authorized `,
          401
        )
      );
  
    }

  course = await Courses.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findById(req.params.id);

  if (!course)
    return next(
      new ErrorResponse(
        `Course with the id ${req.params.id} was not found`,
        404
      )
    );

    if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
      return next(
        new ErrorResponse(
          `User with the ${req.user.id} is not authorized to delete`,
          401
        )
      );
  
    }


  await course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
