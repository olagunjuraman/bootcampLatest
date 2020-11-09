const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please add a name']
    },
    email:{
        type: String,
        // match:[],
        required: [true, 'Please add an email'],
        unique: true
    },
    role:{
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password:{
        type:String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt:{
        type: Date,
        default: Date.now
    }
});

UserSchema.methods.getSignedJWtToken = function(){
    return  jwt.sign({id: this._id} , process.env.JWT_SECRETKEY, {
        expiresIn: process.env.JWT_EXPIRES
    });
};

UserSchema.methods.matchPassword = async function(enteredPassword){
   return await  bcrypt.compare(enteredPassword, this.password);
}

UserSchema.methods.getResetPasswordToken =  function(){
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return resetToken
}

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
  const salt = await bcrypt.genSalt(10);
  this.password =  await bcrypt.hash(this.password, salt);

})

const User = mongoose.model('User', UserSchema);

module.exports = User