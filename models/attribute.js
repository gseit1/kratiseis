const mongoose = require('mongoose');

const attributeSchema = mongoose.Schema({
    name:{
        type:String,
    }
})

const Attribute = mongoose.model('Attribute',attributeSchema);
module.exports = Attribute;