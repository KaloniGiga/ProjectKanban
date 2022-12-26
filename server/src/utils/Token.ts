
import jwt, {Secret} from 'jsonwebtoken';
import RefreshToken from '../models/refreshToken.model';
import mongoose from 'mongoose';


export interface PayloadType {
    _id : string
}

export const generateAccessToken = async (payload:PayloadType) => {
    const accessToken = jwt.sign(payload, process.env.ACCESS_KEY_SECRET!, {expiresIn: "1d"});
    console.log("access token generate");

    return accessToken;
}


export const generateRefreshToken = async (payload:PayloadType) => {
    
   // const refreshTokenExist = await RefreshToken.findOne({userId: payload._id});


    // if(refreshTokenExist){
    //     console.log("refresh token exist for this userid")
    //     try{
    //         await jwt.verify(refreshTokenExist.refreshToken, process.env.REFRESH_TOKEN_SECRET!);
               
    //         console.log("refresh token verified");
    //         return refreshTokenExist.refreshToken;

    //     }catch(err){

    //         await RefreshToken.findByIdAndDelete({userId: payload._id});

    //         const newRefreshToken = await jwt.sign({userId: payload._id}, process.env.REFRESH_TOKEN_SECRET!, {expiresIn: '7d'});

    //          await RefreshToken.create({userId: payload._id, refreshToken: newRefreshToken});

    //          console.log("new refresh token and created and saved to data base")

    //         return newRefreshToken;
    //     }
    // }else {

        const newRefreshToken =  jwt.sign({userId: payload._id}, 'process.env.REFRESH_TOKEN_SECRET!', {expiresIn: '7d'});

        // await RefreshToken.create({userId: payload._id, refreshToken: newRefreshToken});
           
         console.log("refresh token created and saved to database")
        return newRefreshToken;
   // }
}
