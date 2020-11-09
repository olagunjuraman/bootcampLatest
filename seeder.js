const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Bootcamp = require('./model/Bootcamp');
const Course = require('./model/Courses');
const Review = require('./model/Review');
const User = require('./model/User');



dotenv.config({
    path: './config/config.env'
});


mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser : true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// Read JSON FILES
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json` , 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json` , 'utf-8'))


//Import DB
const importData = async()=>{
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses);
        await User.create(users);
        await Review.create(reviews);
        console.log('Data imported')
        process.exit();
    } catch (error) {
        console.log(error)
    }
}

// Delete data
const deleteData = async()=>{
    try {
       await Bootcamp.deleteMany();
       await Course.deleteMany();
       await User.deleteMany();
       await Review.deleteMany();
        console.log('Data destroyed');
        process.exit();
    } catch (error) {
        console.log(error)
    }
 
}

if(process.argv[2] === '-i'){
    importData()
}else if(process.argv[2] === '-d'){
    deleteData()
}