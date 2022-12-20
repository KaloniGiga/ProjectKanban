import mongoose from 'mongoose';

const labelSchema = new mongoose.Schema(
    {

    }
)

const Label = mongoose.model('Label', labelSchema);

export default Label;