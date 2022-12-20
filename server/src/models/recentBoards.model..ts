import mongoose from 'mongoose';

const recentBoardSchema = new mongoose.Schema(
    {

    }
)

const RecentBoard = mongoose.model('RecentBoard', recentBoardSchema);

export default RecentBoard;