const mongoose = require('mongoose');

const regionSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    city:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'City',
        required:true,
    }

}); 

const Region = mongoose.model('Region',regionSchema);
module.exports = Region;