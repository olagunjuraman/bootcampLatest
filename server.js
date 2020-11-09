const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require('./middlewares/error');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cors = require('cors')

//Route files
const bootcamps = require("./routes/bootcamp");
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/user');
const reviews = require('./routes/review')

dotenv.config({
  path: "./config/config.env",
});

const app = express();

//Connect Database
connectDB();

//body parser
app.use(express.json());

app.use(cookieParser());

// Santize data
app.use(mongoSanitize());

// set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max : 100
})

app.use(limiter);

app.use(hpp());

app.use(cors())
// mount route files
app.use("/api/v1/bootcamps", bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews)


app.use(errorHandler)

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
  console.log(`The server is listening on ${PORT} in ${process.env.NODE_ENV}`);
});

