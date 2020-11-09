const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        trim: true,      
        required: true
    },
    description:{
        type:String,
        required: [true, 'Please add a descrption']
    },
    weeks:{
        type:String,
        required:[true, 'Please add number of weeks']
    },
    tuition:{
        type:Number,
        required:[true, 'Please add tuition fee']
    },
    minimumSkill:{
        type:String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    schorlashipAvailable:{
        type: Boolean,
        default: false
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref : 'Bootcamp',
        required: true
    },

    user:{
        type:mongoose.Schema.ObjectId,
        ref : 'User',
        required: true
    },

    createdAt:{
        type:Date,
        default: Date.now
    }
});

courseSchema.statics.getAverageCost = async function(bootcampId){
    const obj = await this.aggregate([
        {
            $match: {bootcamp: bootcampId}
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: {$avg: '$tuition'}
            }
        }
    ]);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        })
    } catch (error) {
        console.log(error)
    }
}

// Call getAverageCost after save
courseSchema.post('save', function(){
    this.constructor.getAverageCost(this.bootcamp)
});

courseSchema.pre('remove', function(){
    this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model('Course', courseSchema)