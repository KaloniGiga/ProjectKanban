import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
    {

    }
)

const Card = mongoose.model('Card', cardSchema);

export default Card;