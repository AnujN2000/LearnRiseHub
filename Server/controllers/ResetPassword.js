const User = reuire("../models/User");
const mailSender=require("../utils/mailSender");
const bcrypt=require("bcrypt");

// resetPassword token
exports.resetPasswordToken = async (req, res) =>{
    try{
          // get email from req body
        const email=req.body.email;
        // check user for this email, email validation
        const user= await User.findOne({email:email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User does not exist"
            });
        }
        // generate token
        const token=crypto.randomUUID();

        // update user by adding token and expiration time
        // by adding new:true we get updated document in the response
        const updateDetails= await User.findOneAndUpdate(
                                        {email:email},
                                        {
                                            token:token,
                                            resetPasswordExpires:Date.now()+5*60*1000,
                                        },
                                        {new:true} )

        // create url 
        const url= `http://localhost:update-password/${token}`

        // send mail containing the url
        await mailSender(email,"Password Reset Link",
                        `Password Rest Link: ${url} `);
        // return response
        return res.json({
            success:true,
            message:"Email sent successfully"
        });
    }
    catch(error){
       console.log(error);
       return res.status(500).json({
        success:false,
        message:"Something went wrong while sending the reset password mail"
       })
    }
}

// reset password

exports.resetPassword= async (res,req) =>{
     try{
        // data fetch
        const {password, confirmPassword,token}=req.body;
        // validation
        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:'Password not matching'
            });
        }
        // we inserted token in the db so that we can update password in the db
        // get userdetails from db using token
        const userDetails= await User.findOne({token:token});
        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is invalid"
            })
        }
        if(updateDetails.resetPasswordExpires < Date.now()){
        return res.json({
            success:false,
            message:"Token is expired, please regenerate your token/resetPassword link"
        })
        }
        // hash password
        const hashedPassword= await bcrypt.hash(password,10);
        // update password 
        await User.findOneAndUpdate(
           {token:token},
           {password:hashedPassword},
           {new:true},
        );
        return res.status(200).json({
            success:false,
            message:"Password reset successfully"
        })
     }
     catch(error){
        console.log(error);
        return res.status(500).json({
        success:false,
        message:"Something went wrong while reseting password "
       })
     }
}

