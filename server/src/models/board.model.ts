import mongoose from "mongoose";


const boardMemberSchema = new mongoose.Schema({

    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    role: {
        type: String,
        enum: [],
        default: 'Normal'
    },


})


const boardSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30,
        trim: true,
    },

    visibility: {
        type: String,
        default: 'PUBLIC'
    },

    description: {
        type: String,
        required: false,
        trim: true,
    },

    labels: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Label',
                required: true,
            }
        ],
        default: [],
    },

    color: {
        type: String,
        default: 'white'
    },

    workspaceid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkSpace',
        require: true,
    },

    lists: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'List',
                required: true,
            },
        ],
        default: [],
    },

    members: {
        type: [boardMemberSchema],
        default: []
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

}, {timestamps: true});


const Board = mongoose.model('Board', boardSchema);

export default Board;