const User= require("../models/User");
const OTP =require("../models/OTP");
const otpGenerator=require("otp-generator");



// sendOTP
exports.sendOTP= async(req,res) =>{
   try{
    // fetch email from request body
    const {email}= req.body;
    // check if use already exist
    const checkUserPresent = await User.findOne({email});

    if(checkUserPresent){
        return res.json(401).json({
            success:false,
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
    const result = await OTP.findOne({otp: otp});

    while(result){
        otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        result = await OTP.findOne({otp: otp});
    }
    
    const otpPayload={email,otp};
    
    const otpBody= await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
        success:true,
        message:'OTP sent successfully',
    })
   }
   catch(error){
      console.log(error);
      return res.json({
        success:false,
        message:error.message
      })
   }

}



// signup



// login



// change password