const User= require("../models/User");
const OTP =require("../models/OTP");
const otpGenerator=require("otp-generator");
const bcrypt=require("bcrypt");
const jwt= require("jsonwebtoken");
require("dotenv").config();


// sendOTP
exports.sendOTP= async(req,res) =>{
   try{
    // fetch email from request body
    const {email}= req.body;
    // check if use already exist
    const checkUserPresent = await User.findOne({email});

    if(checkUserPresent){
        return res.json(401).json({
            message:'User already registered',
        })
    }

    // generate otp
    let otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    })
    console.log("OTP generated: ", otp);
    // check unique otp or not
    let result = await OTP.findOne({otp: otp});

    while(result){
        otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        result = await OTP.findOne({otp: otp});
    }
    
    const otpPayload={email,otp};
    
    // create entry in db
    const otpBody= await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
        message:'OTP sent successfully',
        otp,
    })
   }
   catch(error){
      console.log(error);
      return res.status(500).json({
        message:error.message
      })
   }

}



// signup
exports.signUp= async(req,res) =>{
  try{
        // data fetch from req body
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        otp
    }= req.body;

    // validate
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
        return res.status(403).json({
            message:"All fields are required",
        })
    } 
    // match passwords
    if(password!== confirmPassword){
        return res.status(400).json({
            message:"password and ConfirmPassword value does not match, please try again"
        });
    }
    // check user already exist or not
    const existingUser= await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:'User is already registered',
        });
    }

    // find most recent otp stored for the user
    const recentOtp= await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);
    // validate otp
    if(recentOtp.length ===0){
        // otp not found
        return res.status(400).json({
            message:"OTP not found",
        })
    }
    else if(otp!==recentOtp){
        return res.status(400).json({
            message:"Invalid OTP",
        })
    }

    // hash password
    const hashedPassword= await bcrypt.hash(password,10);
    // create entry in db of the new user

    const profileDetails = await Profile.create({
        gender:null,
        dataOfBirth:null,
        about:null,
        contactNumber:null,
    });

    const user= await User.create({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })

    // return res
    return res.status(200).json({
        message:"User registered successfully",
        user,
    })
  }
  catch(error){
     console.log(error);
     return res.status(500).json({
        message:"User could not be registered. Please try again."
     })
  }
}


// login 
exports.login = async(req,res) =>{
    try{
    // get data from req body
    const {email,password}=req.body;
    // validation data
    if(!email|| !password){
       return res.status(403).json({
        success:false,
        message:"All fields are required, please try again by filling all details"
       })
    }
    // user existance check
    const user=await User.findOne({email}).populate("additionalDetails");
    if(!user){
        return res.status(401).json({
            message:"User is not registered, please signup first"
        })
    }
    // generate JWT, after password matching 
    if(await bcrypt.compare(password,user.password)){
        const payload={
            email:user.email,
            id:user._id, 
            accountType:user.accountType,
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h",
        });
        user.token=token;
        user.password=undefined;

        // create cookie and send response
        const options={
            expires: new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
        }
        res.cokkie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"Logged in successfully"
        })
    }
    else{
        return res.status(401).json({
            message:'Password is incorrect',
        });
    }
    
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Login failure, please try again"
        });
    }
}


// change password
exports.changePassword =async(req,res)=>{
    // get data from req body
    // get oldPassword, newPassword, confirmNewPassword
    // validation
    
    // update pwd in db
    // send email- password updated
    // return res
}