const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    //getUserId
    const userId = req.user.id;

    if (!contactNumber || !gender || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //find profile
    const userDetails = await User.findById(userId);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;

    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// deleteAccount
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //    delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    // todo: unenroll user from all courses
    // delete user
    await User.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      message: "User Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "User could not be deleted",
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.status(200).json({
      message: "User Data fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
