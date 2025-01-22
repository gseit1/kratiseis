const mongoose = require ('mongoose');

const reviewSchema = mongoose.Schema({
    text:{
        type:String,
        required:true,
    },

    rating : {
        type:Number,
        required:true,
        min:1,
        max:5,
    },

    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Shop',
        required:true,
    },


});

const Review = mongoose.model('Review',reviewSchema);
module.exports = Review;