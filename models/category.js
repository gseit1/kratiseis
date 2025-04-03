const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

    image:{
        type:String,
        required:true,
    },

    count:{
        type:Number,
        default:0,
    }
});

const Category = mongoose.model('Category',categorySchema);
module.exports = Category;