const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// createCourse handler function
exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    const thumbnail = req.files.thumbnailImage;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      res.status(400).json({
        message: "All fields are required",
      });
    }

    //make a db call to get instructorId
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("InstructorDetails", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        message: "Instructor Details not found",
      });
    }

    // tag validation
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        message: "Tag details not found",
      });
    }

    // upload image to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnailImage: thumbnailImage.secure_url,
    });

    // update instructor courses
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // todo: update tag ka schema

    return res.status(200).json({
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Faild to create new Course",
      error: error.message,
    });
  }
};

// getAllCourses handler function

exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Cannot fetch course data",
      error: error.message,
    });
  }
};

// getCourseDetails

exports.getCourseDetails= async(req, res)=>{
  try{
     
  }
  catch(error){

  }
}