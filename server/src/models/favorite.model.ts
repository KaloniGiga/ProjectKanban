import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
    
});

const Favorite = mongoose.model("Favorite", FavoriteSchema);

export default Favorite;