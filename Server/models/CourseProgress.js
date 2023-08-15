const mongoose=require("mongoose");

const courseProgress=new mongoose.Schema({
// kis course ki baat ho rahi hai uske liye
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    completedVideo:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection"
        }
    ]

});

module.exports=mongoose.model("CourseProgress",courseProgress);