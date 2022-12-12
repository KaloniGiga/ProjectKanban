
import mongoose, {Schema, Document} from "mongoose";
import User from "./user.model";


const RefreshTokenSchema: Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true,
    },

    refreshToken: {
        type: String,
        required: true,
    },

}, {timestamps: true})


const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;