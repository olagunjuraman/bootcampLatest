const express = require("express");
const router = express.Router({mergeParams: true});

const {protect, authorize} = require('../middlewares/auth')

const {
  getCourses,
  addCourse,
  deleteCourse,
  updateCourse,
  getCourse,
} = require("../controller/courses");

const advancedResult = require('../middlewares/advancedResults');

const Course = require('../model/Courses');

router.route("/").get(advancedResult(Course, {
  path: 'bootcamp',
  select: 'name description'
}),getCourses).post(protect, authorize('publisher', 'admin'),addCourse)
router.route("/:id").get(getCourse).put(protect, authorize('publisher', 'admin'),updateCourse).delete(protect, authorize('publisher', 'admin'), deleteCourse)

module.exports = router;
