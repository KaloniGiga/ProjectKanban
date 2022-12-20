import mongoose from 'mongoose';

const listSchema = new mongoose.Schema(
    {

    }
)

const List = mongoose.model('List', listSchema);

export default List;