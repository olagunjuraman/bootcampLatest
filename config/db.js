const mongoose = require('mongoose');

const connectDB = async()=>{ 
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useCreateIndex: true,
            useNewUrlParser : true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
            console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error.message)
    }
 
}

module.exports = connectDB
