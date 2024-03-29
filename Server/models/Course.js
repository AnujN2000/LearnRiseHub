// Calling pre() or post() after compiling a model does not work in Mongoose in general.
//  you must add all middleware and plugins before calling mongoose.model()
// post middleware are executed after the hooked method and all of its pre middleware have completed.

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  courseDescription: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  tag: [
    {
      type: [String],
      required: true,
    },
  ],
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  instructions:{
    type:[String],
  },
  status:{
    type:String,
    enum:["Draft","Published"]
  }
});
// model name, courseSchema
// Compile a model from the schema
module.exports = mongoose.model("CourseSchema", courseSchema);
