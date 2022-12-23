import mongoose, { mongo } from 'mongoose';


interface I_RecentVisitedDocument {
   userId: mongoose.Schema.Types.ObjectId,
   boardId: mongoose.Schema.Types.ObjectId,
   lastVisited: Date,
}

const recentBoardSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },

      boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true
      },

      lastVisited: Date,

    }, {timestamps: true}
)

const RecentBoard = mongoose.model('RecentBoard', recentBoardSchema);

export default RecentBoard;