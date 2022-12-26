import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ErrorHandler } from "../utils/ErrorHandler";
import validator from "validator";
import List from "../models/list.model";
import Board from "../models/board.model";
import Card from "../models/cards.model.";
import User from "../models/user.model";

export const createCard = async (req:any, res:Response, next:NextFunction) => {
    
    try{
        const {listId, name, position} = req.body;
        
        if(!listId){
            return next(new ErrorHandler(400, "listId is required"))
        }else if(!mongoose.isValidObjectId(listId)){
            return next(new ErrorHandler(400, "listId is not valid"))
        }

        if(!name){
            return next(new ErrorHandler(400, "Name of a card is required"))
        }else if(name.length > 50){
            return next(new ErrorHandler(400, "Card name must be less than 50 chars"))
        }

        if(!position){
            return next(new ErrorHandler(400, "Position is required"))
        }else if(!validator.isAscii(position)){
            return next(new ErrorHandler(400, "position must be a ascii"))
        }

        
        const list = await List.findOne({_id: listId}).select("_id boardId cards")
        .populate({
            path: "cards",
            select: "_id pos",
            options: {
                sort: position
            }
        })

        if(!list){
            return next(new ErrorHandler(404, "List not found"))
        }

        const board = await Board.findOne({_id: list.boardId}).select("_id workspaceId members visibility")
        .populate({
            path: "workspaceId",
            select: "_id name members"
        })


        //check the role of the user in both board and workspace
        const boardMemberRole = board?.members.find(
            (member:any) => member.memberId.toString() === req.user._id.toString()
        )?.role


        const workspaceMemberRole = board?.workspaceId.members.find(
            (member:any) => member.memberId.toString() === req.user._id.toString()
        )?.role


        if(!boardMemberRole && !workspaceMemberRole){
            return next(new ErrorHandler(400, "You can't create a list"))
        }

        if(!boardMemberRole && workspaceMemberRole !== "ADMIN"){
            return next(new ErrorHandler(400, "First join the board"))
        }

        if(boardMemberRole !== "ADMIN"){
            return next(new ErrorHandler(400, "Don't have a permission to create a list"))
        }


        let lastPosition = position;

        const positionTaken = list.cards.find((card:any) => {
             card.position === position
        })


        if(positionTaken){

            let maxpos = 0;
            list.cards.forEach((card:any) => {
                if(card.position > maxpos){
                    maxpos = card.position
                }

                lastPosition = maxpos;
            })
        }

        
        const card = new Card({
            name: validator.escape(name),
            listId: list._id,
            position: lastPosition
        })


        list.cards.push(card._id);

        await card.save();
        await list.save();

        res.status(200).json({
            success: true,
            data: {
                _id: card._id,
                name: card.modelName,
                
                listId: card.listId,
                position: card.position,
               
            }
        })

    }catch(error) {

        res.status(500).json({success: true, message: "Oops! Something went wrong"})

    }
}



export const getAllMyCards = async (req:any, res:Response, next:NextFunction) => {
      
    try{
        const myCards = await Card.find({members: {$elemMatch: {memberId: req.user._id}}})
        .populate({
            path: "listId",
            select: "boardId",
            populate: {
                path: "boardId",
                select: "_id workspaceId"
            }
        }).populate({
            path: "members",
            select: '_id username picture'
        }).populate({
            path: "labels",
            select: '_id name color position'
        })


        res.status(200).json({
            success: true,
            cards: myCards.map((card:any) => {
                return {
                    _id: card._id,
                    name: card._id,
                    description: card._id,
                    color: card.color,
                    boardId: card.listId.boardId._id,
                    workspaceId: card.listId.boardId.workspaceId,
                    expireDate : card.expireDate,
                    isComplete: card.isComplete,
                    listId: card.listId._id,
                    position: card.position,
                    comments: card.comments.length,
                    members: card.members

                }
            })
        })


    }catch(error){
        res.status(500).json({success: false, message: "Oops! Something went wrong!"})
    }
}




export const getACard = async (req:any, res:Response, next:NextFunction) => {

     try {
        
        const {id} = req.params;
        
        //validate
        if(!id) {
           return next(new ErrorHandler(400, "CardId is required"))
        }else if(!mongoose.isValidObjectId){
            return next(new ErrorHandler(400, "cardId is invalid"))
        }

        const card = await Card.findOne({_id: id})
        .select("_id name listId position description color expireDate members labels comments isComplete")
        .populate({
            path: "labels",
            select: "_id name color position"
        }).populate({
            path: "members",
            select: "_id name picture"
        })
        .populate({
            path: "comments",
            select: "_id user createdAt description",
            populate: {
                path: "user",
                select: "_id name picture"
            },
            options: {
                sort: {createdAt: -1}
            }
        }).lean()

        
        if(!card){
            return next(new ErrorHandler(404, "Card not found"))
        }

        
         const list = await List.findOne({_id: card.listId}).select("_id boardId").
         populate({
            path: 'boardId',
            select: '_id workspaceId members visibility'
         })
         .lean();

         const board = await Board.findOne({_id: list?.boardId}).select("_id workspaceId members lists visibility")
         .populate({
            path: "workspaceId",
            select: "_id name members",
         })

         const boardMemberrole = list?.boardId.members.find((m:any) => m.memberId.toString() === req.user._id.toString())?.role
         
         const workspaceMemberRole = list?.boardId.workspaceId.members.find((member:any) => member.memberId.toString() === req.user._id.toString())?.role
        //check if the user is the boardAdmin or the workspaceAdmin
        
        if(!boardMemberrole && !workspaceMemberRole){
            return next(new ErrorHandler(400, "board not found"))
        }

        if(!boardMemberrole && workspaceMemberRole && board?.visibility === "PRIVATE"){
                return next(new ErrorHandler(400, "Board not found"))
        }

        if(!boardMemberrole && workspaceMemberRole !== 'ADMIN'){
            return next(new ErrorHandler(400, "You can't access the board details"))
        }

        //Now that the person is boardadmin boardmembere or workspace admin

        res.status(200).json({
            success: true,
            card: {
                _id: card._id,
                listId: card.listId,
                description: card.description,
                position: card.position,
                color: card.color,
                name: card.name,
                expireDate: card.expireDate,
                isComplete: card.isComplete,
                members: card.members,
                labels: card.label,
                comments: card.comments
            }
        })

     } catch (error) {
        res.status(500).json({success: false, message: "Oops! Something went wrong!"})
     }
}


export const addMember = async (req:any, res:Response, next:NextFunction) => {

    try {
        const {id} = req.params;
        const {memberId} = req.body;

        if(!id){
            return next(new ErrorHandler(400, "cardId is required"))
        }else if(!mongoose.isValidObjectId){
            return next(new ErrorHandler(400, "cardId is invalid"))
        }

        if(!memberId){
            return next(new ErrorHandler(400, "memberId is required"))
        }else if(!mongoose.isValidObjectId){
            return next(new ErrorHandler(400, "memberId is invalid"))
        }


        const card = await Card.findOne({_id: id}).select("_id listId members");

        if(!card) {
            return next(new ErrorHandler(404, "Card not found"))
        }

        const list = await List.findOne({_id: card.listId}).select("_id boardId").lean();

        const board = await Board.findOne({_id: list?.boardId}).select("_id name visibility workspaceId members")
        .populate({
            path: "workspaceId",
            select: "_id members",
        });


        const boardMemberrole = list?.boardId.members.find((m:any) => m.memberId.toString() === req.user._id.toString())?.role
         
        const workspaceMemberRole = list?.boardId.workspaceId.members.find((member:any) => member.memberId.toString() === req.user._id.toString())?.role
       //check if the user is the boardAdmin or the workspaceAdmin
       
       if(!boardMemberrole && !workspaceMemberRole){
           return next(new ErrorHandler(400, "board not found"))
       }

       if(!boardMemberrole && workspaceMemberRole && board?.visibility === "PRIVATE"){
               return next(new ErrorHandler(400, "Board not found"))
       }

       if(!boardMemberrole && workspaceMemberRole !== 'ADMIN'){
           return next(new ErrorHandler(400, "You can't access the board details"))
       }

       
     //now check if memberId is a member of workspace or a board
     if(!board?.members.map((member:any) => member.memberId.toString()).includes(memberId) && board?.workspaceId.members.map((member:any) => member.memberId.toString).includes(memberId)) {
        return next(new ErrorHandler(400,"This member cannot be added to the board"))
     }


     if(card.members.map((member:any) => member.memberId.toString()).includes(memberId)){
        return next(new ErrorHandler(400, "Already a member of a card"))
     }

     card.members.push(memberId);
     await card.save();

     const newCardMember = await User.findOne({_id: memberId}).select("_id username picture").lean()

     return res.status(200).json({
        success: true,
        newAddedMember: newCardMember   
     })
       
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Oops! Something went wrong!"
        })
    }
}




export const removeCardMember = async (req: any, res: Response, next: NextFunction) => {
      
    try {
        const {id} = req.params;
        const {memberId} = req.body;

        if(!id){
            return next(new ErrorHandler(400, "cardId is required"))
        }else if(!mongoose.isValidObjectId){
            return next(new ErrorHandler(400, "cardId is invalid"))
        }

        if(!memberId){
            return next(new ErrorHandler(400, "memberId is required"))
        }else if(!mongoose.isValidObjectId){
            return next(new ErrorHandler(400, "memberId is invalid"))
        }


        const card = await Card.findOne({_id: id}).select("_id listId members");

        if(!card) {
            return next(new ErrorHandler(404, "Card not found"))
        }

        const list = await List.findOne({_id: card.listId}).select("_id boardId").lean();

        const board = await Board.findOne({_id: list?.boardId}).select("_id name visibility workspaceId members")
        .populate({
            path: "workspaceId",
            select: "_id members",
        });


        const boardMemberrole = list?.boardId.members.find((m:any) => m.memberId.toString() === req.user._id.toString())?.role
         
        const workspaceMemberRole = list?.boardId.workspaceId.members.find((member:any) => member.memberId.toString() === req.user._id.toString())?.role
       //check if the user is the boardAdmin or the workspaceAdmin
       
       if(!boardMemberrole && !workspaceMemberRole){
           return next(new ErrorHandler(400, "board not found"))
       }

       if(!boardMemberrole && workspaceMemberRole && board?.visibility === "PRIVATE"){
               return next(new ErrorHandler(400, "Board not found"))
       }

       if(!boardMemberrole && workspaceMemberRole !== 'ADMIN'){
           return next(new ErrorHandler(400, "You can't access the board details"))
       }

       //check if memberId is a card member or not
       if(!card.members.map((member:any) => member.memberId.toString()).includes(memberId)){
           return next(new ErrorHandler(400, "MemberId is not a member of card"))
       }

       //remove memberId from card members
       card.members = card.members.filter((member:any) => member.memberId.toString() !== memberId);
        
       await card.save();

       res.status(200).json({success: true, message: "Member removed from card"});

    } catch (error) {
        
        res.status(500).json({
            success: false,
            message: "Oops, something went wrong!"
        })

    }

}



