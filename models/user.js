const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        trim:true,
    },

    email:{ 
        type:String,
        required:true,
        trim:true,
        validate:{
            validator:(value)=>{
                const result=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return result.test(value);
            },
            message : "Enter valid email",
        }
    },

    state:{
        type:String,
        default: "",
    },

    password:{
        type:String,
        required:true,
        validate:{
            validator:(value)=>{
                //Chech if pass is 4 chars long
                return value.length>=4;

            },
            message :"Password must be at least 4 chars long",
        }
    },

    city:{
        type:String,
        default: "",
    },

    locality:{
        type:String,
        default: "",
    },

    
});

const User = mongoose.model("User", userSchema);

module.exports = User;