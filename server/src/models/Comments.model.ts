import mongoose from 'mongoose';
import { I_CardDocument } from './cards.model.';
import { I_UserDocument } from './user.model';


export interface I_CommentDocument extends mongoose.Document {
   commentText: String,
   user: I_UserDocument & {_id: mongoose.Schema.Types.ObjectId },
   cardId: I_CardDocument & {_id: mongoose.Schema.Types.ObjectId }
}


const commentSchema = new mongoose.Schema(
    {

      commentText: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 255,
      },

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      cardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
        required: true,
      },
    },
    {timestamps: true }
)

const Comments = mongoose.model('Comment', commentSchema);

export default Comments;