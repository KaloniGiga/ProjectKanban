import mongoose from 'mongoose';
import { I_UserDocument } from './user.model';
import { Schema } from 'mongoose';
import { I_CommentDocument } from './Comments.model';
import { I_LabelDocument } from './Label.model';
import { I_ListDocument } from './list.model';

export interface I_CardDocument extends mongoose.Document {
name: string,
description: string,
position: Number,
members:   {memberId: I_UserDocument & { _id: mongoose.Schema.Types.ObjectId}}[],
listId: { _id: I_ListDocument &  mongoose.Schema.Types.ObjectId},
color: string,
expireDate: Date,
label: { _id: I_LabelDocument & mongoose.Schema.Types.ObjectId}[],
isComplete: string,
comments: {_id: I_CommentDocument & mongoose.Schema.Types.ObjectId }[]
creator: {_id: I_UserDocument & mongoose.Schema.Types.ObjectId}
}


const cardSchema:Schema<I_CardDocument> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        position: {
            type: Number,
            required: true,
        },

        members: {
            type: [{
                memberId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
                }
        }],
            default: []
        },

        listId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'List',
            required: true
         },
         color: {
            type: String,
            required: true
         },
         isComplete: {
            type: String,
            required: true
         },
         expireDate: {
            type: Date,
            required: true
         },
         label: {
            type: [{ 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Label',
                required: true
            }],
            default: []
         },

         comments: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comments',
                required: true
            }],

            default: []
         },

         creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
         }
    },
    { timestamps: true }
)

const Card = mongoose.model('Card', cardSchema);

export default Card;