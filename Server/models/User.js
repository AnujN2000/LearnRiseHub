const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        enum:["Admin","Instructor,Student"],
        requried:true
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile"
    },
    courses:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses"
        }
    ],
    image:{
      type:String,
      reuired:true,
    },
    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgress",
    }],

});

module.exports=mongoose.model("User",userSchema);