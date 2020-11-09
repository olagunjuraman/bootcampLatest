const express = require("express");
const router = express.Router();

const {protect, authorize} = require('../middlewares/auth')
const {
  createBootCamp,
  getBootCamp,
  getBootCamps,
  deleteBootCamp,
  updateBootCamp,
  getBoootCampsInRadius
} = require("../controller/bootcamp");

const Bootcamp = require('../model/Bootcamp');

const advancedResult = require('../middlewares/advancedResults')
const courseRouter = require('./courses');
const reviewRouter = require('./review');


router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);



router.route('/radius/:zipcode/:distance').get(getBoootCampsInRadius)

router.route("/").get(advancedResult(Bootcamp, 'courses'), getBootCamps).post(protect, authorize('publisher','admin'), createBootCamp);

router
  .route("/:id")
  .get(getBootCamp)
  .delete(protect,authorize('publisher', 'admin'), deleteBootCamp)
  .put(protect, authorize('publisher', 'admin'), updateBootCamp);

module.exports = router;
