const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

    ImageUrl:{
        type:String,
        required:true,
    },

    regions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Region',
        default:[],
    }],

});

const City = mongoose.model('City',citySchema);
module.exports = City;