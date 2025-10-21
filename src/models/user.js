const mongoose = require("mongoose");
const { Schema } = mongoose;

const gender = ['male', 'female']

const userSchema = new Schema({        
    firstName :{
            type:String,
            require:true,
            minLength: 3,
            maxLength: 16
        },
        lastName:{
            type:String
        },
        emailId:{
            type:String,
            lowercase:true,
            require:true,
            unique:true,
            trim:true
        },
        password:{
            type:String
        },
        age:{
            type:Number,
            min: 18,
            max: 60
        },
        gender:{
            type:String,
            enum:gender
        },
        photoUrl:{
            type:String,
            default:"https://hancockogundiyapartners.com/management/dummy-profile-pic-300x300/"
        },
        about:{
            type:String,
            default:"This is a default about  of a user"
        },
        skills:{
            type:[String]
        },
        familyType:{
            type:String,
            validate(status){
                if(!["middleClass","highClass"].includes(status)){
                    throw new Error("Invalid family type!");
                    
                }

            }
        }
    },
    {
        timestamps:true
    });
    
    
module.exports.User = new mongoose.model("User",userSchema);