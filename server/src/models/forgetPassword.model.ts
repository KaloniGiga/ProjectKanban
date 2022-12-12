
import mongoose, {Schema, Document} from "mongoose";
import User from "./user.model";




const ForgetPasswordSchema: Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true,
    },

    resetPasswordToken: {
        type: String,
        required: true,
    },

    resetPasswordTokenExpire: {
        type: Date,
        required: true,
        default : Date.now() + 1000 * 60 * 15,
    }

}, {timestamps: true})


const ForgetPassword = mongoose.model("ForgotPassword", ForgetPasswordSchema);

export default ForgetPassword;