const express = require("express");
const router = express.Router();

const {protect, authorize} = require('../middlewares/auth')

const {
 createUser,deleteUser,getUsers,getUser,updateUser}
 = require("../controller/user");

const advancedResult = require('../middlewares/advancedResults');

const User = require('../model/User');

router.use(protect);
router.use(authorize('admin'))

router.route("/").get(advancedResult(User),getUsers).post(createUser)
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser)

module.exports = router;

