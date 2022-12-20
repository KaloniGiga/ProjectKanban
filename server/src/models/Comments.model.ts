import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {

    }
)

const Comments = mongoose.model('Comment', commentSchema);

export default Comments;