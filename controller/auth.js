const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const User = require("../model/User");
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto')


exports.registerUser = asyncHandler(async(req, res, next)=>{
    const {name, email, password, role} = req.body;
   const user =  await User.create({
        name,
        email,
        password,
        role
    });
    sendTokenResponse(user, 200, res)
});

exports.login = asyncHandler(async(req, res, next)=>{
    const {email, password} = req.body
    //Validate email and password
    if(!email || !password){
        return next(new ErrorResponse('Please provide an email and password', 400))
    }

    //Check for user
    const user = await User.findOne({email}).select('+password');

    if(!user) return next(new ErrorResponse('invalid credentials', 404));

    const isMatch = await user.matchPassword(password);
    if(!isMatch) return next(new ErrorResponse('invalid credentails'));

   sendTokenResponse(user, 200, res);

    res.status(200).json({
        success: true,
        token
    });
});

exports.logOut = asyncHandler(async(req, res, next)=>{
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    }) 
      res.status(200).json({
      success: true,
      data : {}
  });
  })
  

exports.getMe = asyncHandler(async(req, res, next)=>{
  const user = await User.findById(req.user.id);
    if(!user) return next(new ErrorResponse('User not found', 404));
  
    res.status(200).json({
    success: true,
    user
});

})

exports.forgotPassword = asyncHandler(async(req, res, next)=>{
    const {email} = req.body
    const user = await User.findOne({email});
    if(!user) return next(new ErrorResponse('incorrect email', 404));

    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `You are receiving this message because you want to reset your password. please make a put request to:
     \n\n ${resetURL}`

    const options = {
        email: user.email,
        subject: 'Password reset token',
        message
    }
    try {
        await sendEmail(options)
        
    res.status(200).json({
        success: true,
        data: 'Email Sent'
    });
    } catch (error) {
        console.log(error.message);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});
        return next(new ErrorResponse('Email could not be sent', 500))
    }
 

});

exports.resetPassword = asyncHandler(async(req, res, next)=>{
    
  const resetPasswordToken =  crypto.createHash('sha256').update(req.params.resettoken).digest('hex')

  const user = await User.findOne({resetPasswordToken, resetPasswordExpire: {$gt: Date.now()}});

  if(!user){
    return next(new ErrorResponse('Invalid token', 400))
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
    
    await user.save();
      sendTokenResponse(user, 200, res);

});

exports.updateDetails = asyncHandler(async(req, res, next)=>{
    const fieldsToUpdate = {
        name : req.body.name,
        email: req.body.email
    }

  const user =  await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        user
    });

});

exports.updatePassword = asyncHandler(async(req, res, next)=>{
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(req.body.currentPassword);

    if(!isMatch){
        return next(new ErrorResponse('Password is incorrect', 401));
  
    }
    user.password = req.body.newPassword;

    await user.save();

    sendTokenResponse(user, 200, res);

})

const sendTokenResponse = (user, statusCode, res)=>{
    const token =  user.getSignedJWtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    })
};


