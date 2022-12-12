import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import validator from "validator";
import { ErrorHandler } from "../utils/ErrorHandler";
import ForgetPassword from "../models/forgetPassword.model";
import crypto from 'crypto';
import { SendEmail } from "../utils/sendEmail";
import EmailVerify from "../models/emailVerify.model";
import RefreshToken from "../models/refreshToken.model";
import { generateAccessToken, generateRefreshToken } from "../utils/Token";


export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
   
    try{
        const { email } = req.body;

        if(!email) {
            return next(new ErrorHandler(400, "Email is required"));

        }else if(!validator.isEmail(email)) {

            return next(new ErrorHandler(400, "Invalid email"));
        }

        const user = await User.findOne({email: email});

        if(!user){

           return next(new ErrorHandler(400, "this email does not exist"));
        }

        if(user.isGoogleAuth){
            return next(new ErrorHandler(400, "You cannot reset password for this account"));
        }

        //await ForgetPassword.deleteOne({userId: user._id});
        
        const resetPasswordToken = await crypto.randomBytes(20).toString('hex');
        const forgetPassword = await ForgetPassword.create({
            userId: user._id,
            resetPasswordToken: resetPasswordToken,
            resetPasswordTokenExpire: 1000*60*60
        });


        const mailOptions = {
            from: process.env.GMAIL,
            to: email,
            subject: 'Forget Your Password',
            html: `
               <h1>Forgot your password</h1>
               <p style="font-size: 16px; font-weight: 600;">Click the link below to reset your password</p>
               <a style="font-size: 14px;" href=${process.env.CLIENT_URL}/reset/password/${resetPasswordToken}" target="_blank">Click here to reset your password.</a>
            `
        };

        
        //send email
        SendEmail(mailOptions);

        res.status(200).json({success: true, message: "Email sent to your email address to reset password"});

    }catch(error){

        next(new ErrorHandler(500, "Oops, something went wrong"));
    }

}



export const resetPassword = async (req:Request, res:Response, next:NextFunction) => {

    try{
         const token = req.params;
         const {password, confirmPassword} = req.body;

         if(!password || !confirmPassword){
            return next(new ErrorHandler(400, "All fields is required"));
         }else if(password.length < 8){

           return next(new ErrorHandler(400, "Password must be at least 8 characters long"))
         }else if(!/\d/.test(password) || !/[a=zA-Z]/.test(password) || !/[@#$%6&*,.?!]/.test(password)){

            return next(new ErrorHandler(400, "Password must contain at least one capital and small letter, one digit and one special character"));
         }


         if(confirmPassword != password) {

            return next(new ErrorHandler(400, "password and confirmpassword must match."))
         }


         const TokenExist = await ForgetPassword.findOne({resetPasswordToken: token, resetPasswordTokenExpire: {$gt: new Date(Date.now())}});

         if(!TokenExist){
            return next(new ErrorHandler(404, "Your password reset link has expired"));
         }

         const user = await User.findOne({_id: TokenExist.userId});

         if(!user){
            await ForgetPassword.deleteOne({_id: TokenExist._id});
            await EmailVerify.deleteOne({userId: TokenExist.userId});
            await RefreshToken.deleteOne({userId: TokenExist.userId});

            return next(new ErrorHandler(404, "User is invalid"))
         }

         user.hashedPassword = password;
         user.isGoogleAuth = false,

         user.emailVerified = true;
 
         await EmailVerify.deleteOne({userId: user._id});
         await RefreshToken.deleteOne({userId: user._id});
         await ForgetPassword.deleteOne({_id: TokenExist._id});

         await user.save();


         const accessToken = await generateAccessToken({_id: user._id.toString()});
         const refreshToken = await generateRefreshToken({_id: user._id.toString()});

         return res.status(201).json({success: true, token: {accessToken, refreshToken}, message: "password reset successfull"});

    }catch(error) {
          
        next(new ErrorHandler(500, "something went wrong"))
         
    }
}






export const updateProfile = async (req: Request, res:Response, next:NextFunction) => {

    try {
        
       if(Object.keys(req.body).includes("username")){

            const { username } = req.body;

          if(!username){
             return next(new ErrorHandler(400, "username is required"))
          }



       }

    } catch (error) {
        
    }
}




export const deleteProfile = async (req:Request, res:Response, next:NextFunction) => {
       
try{
    //  await RefreshToken.deleteOne({userId: req.userId});
    //  await EmailVerify.deleteOne({userId: req.userId});
    //  await ForgetPassword.deleteOne({userId: req.userid});
    //  await User.deleteOne({_id: req.userId});
     
     return res.status(201).json({success: true, message: "User account deleted successfully"});
}catch(error) {

     return res.status(400).json({success: false, error: error });
}

}






export const updatePassword = async (req:any, res:Response, next:NextFunction) => {
  
    try{
       const {password, confirmPassword} = req.body;

       if(!password || !confirmPassword){
        return next(new ErrorHandler(400, "All fields is required"));
     }else if(password.length < 8){

       return next(new ErrorHandler(400, "Password must be at least 8 characters long"))
     }else if(!/\d/.test(password) || !/[a=zA-Z]/.test(password) || !/[@#$%6&*,.?!]/.test(password)){

        return next(new ErrorHandler(400, "Password must contain at least one capital and small letter, one digit and one special character"));
     }


     if(confirmPassword != password) {

        return next(new ErrorHandler(400, "password and confirmpassword must match."))
     }


      const user = await User.findOne({_id: req.user._id});
        
      if(!user){
         return next(new ErrorHandler(400, "Invalid user"));
      }

      user.hashedPassword = password;

      await user?.save();

      res.status(201).json({success: true, message: "Password updated successfully"})

    }catch(error){
    
        res.status(500).json({success: false, error});
    }
}










