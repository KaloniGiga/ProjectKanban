import mongoose from 'mongoose';
import { I_BoardDocument } from './board.model';

export interface I_LabelDocument extends mongoose.Document {

name: string,
position: string,
color: string,
boardId: I_BoardDocument & mongoose.Schema.Types.ObjectId

}



const labelSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true, 
        minLength: 2,
        maxLength: 255
      },

      color: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(value:String) {
                return value[0] === '#'
            },
            message: 'Color must be in hex format'
        },
      },

      position: {
        type: Number,
        required: true,
        max: 10
      },

      boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
      },
    },
    {timestamps: true}
);

const Label = mongoose.model('Label', labelSchema);

export default Label;