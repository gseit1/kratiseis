const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

    image:{
        type:String,
        required:true,
    },

    regions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Region',
        default:[],
    }],

    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }

});

const City = mongoose.model('City',citySchema);
module.exports = City;