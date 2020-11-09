const express = require("express");
const router = express.Router();

const {login, registerUser, getMe, forgotPassword, resetPassword, updateDetails, updatePassword,logOut} = require('../controller/auth');

const {protect} = require('../middlewares/auth')

router.route('/register').post(registerUser);
router.route('/login').post(login);
router.route('/getMe').get(protect, getMe);
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetpassword/:resettoken').put(resetPassword);
router.route('/updatedetails').put(protect,updateDetails);
router.route('/updatePassword').put( protect, updatePassword);
router.route('/logOut').get(logOut)


module.exports = router;