
import {Response, NextFunction } from "express";
import mongoose, { mongo } from "mongoose";
import { ErrorHandler } from "../utils/ErrorHandler";
import validator from "validator";
import Board from "../models/board.model";
import List from "../models/list.model";
import Card from "../models/cards.model.";
import Comments from "../models/Comments.model";

export const createList = async (req:any, res:Response, next:NextFunction) => {
   
    try {
        const {name, boardId, position} = req.body;
        
        if(!name){
            return next(new ErrorHandler(400, "Name of a List is required"));
        }else if(name.length > 50){
            return next(new ErrorHandler(40, "Name must be less than 50 chars"))
        }


        if(!boardId){
           return next(new ErrorHandler(400, "BoardId is required"))
        }else if(!mongoose.isValidObjectId(boardId)){
           return next(new ErrorHandler(400, "boardId is not valid"))
        }
        
        if(!position){
            return next(new ErrorHandler(400, "Position is required"))
        }else if(position < 100 && !validator.isAscii(position)){
            return next(new ErrorHandler(400, "position is not valid"))
        }

        //get the board
        const board = await Board.findOne({_id: boardId}).select('_id workspaceId lists members visibility')
        .populate({path: "workspaceId", select: "_id name members"})
        .populate({path: "lists", select: "_id pos"})

        if(!board){
            return next(new ErrorHandler(404, "Board not found"))
        }


        //check the role of the user
        const boardMemberRole = board.members.find((member:any) => member.memberId.toString() === req.user._id.toString())?.role

        const workspaceMemberRole = board.workspaceId.members.find((member:any) => member.memberId.toString() === req.user._id.toString)?.role

        if(!boardMemberRole && !workspaceMemberRole){
            return next(new ErrorHandler(400, "You can't create a list"))
        }

        if(!boardMemberRole && workspaceMemberRole !== "ADMIN"){
            return next(new ErrorHandler(400, "First join the board"))
        }

        if(boardMemberRole !== "ADMIN"){
            return next(new ErrorHandler(400, "Don't have a permission to create a list"))
        }

        //verify that position is empty

        const positionTaken = board.lists.find((list:any) => list.position === position);
        let lastPosition = position;
        
        if(positionTaken){
            //create a new position at last

            //implement lexorank algorithm

            let maxpos = 0;

            board.lists.forEach((list:any) => {
                if(list.position > maxpos){
                    maxpos = list.position
                }
            })

            lastPosition = maxpos

        }
        
        
        const newList = new List({
            name: validator.escape(name), 
            boardId: board._id, 
            position: lastPosition,
            creator: req.user._id
        })

        board.lists.push(newList._id)

        await newList.save();
        await board.save()

        res.status(200).json({success: true, message: "List created Successfully"});

    } catch (error) {
        res.status(500).json({success: true, message: "Oops! something went wrong"})
    }
}




export const getLists = async (req:any, res:Response, next:NextFunction) => {

     try {
        const {boardId} = req.params;

        if(!boardId){
            return next(new ErrorHandler(400, "boardId is required"))
        }else if(!mongoose.isValidObjectId(boardId)){
            return next(new ErrorHandler(400, "boardId is not valid"))
        }


        
        const board = await Board.findOne({_id: boardId}).select("_id workspaceId members lists visibility")
        .populate({
            path: "workspaceId",
            select: "_id name members",
        })
        .populate({
            path: 'lists',
            select: "_id name position",
            options: {sort: "position"}
        }).lean();


        if(!board) {
            return next(new ErrorHandler(404, "Board not found"))
        }

           //check the role of the user
           const boardMemberRole = board.members.find((member:any) => member.memberId.toString() === req.user._id.toString())?.role

           const workspaceMemberRole = board.workspaceId.members.find((member:any) => member.memberId.toString() === req.user._id.toString)?.role
   
           if(!boardMemberRole && !workspaceMemberRole){
               return next(new ErrorHandler(400, "You can't create a list"))
           }
   
           if(!boardMemberRole && workspaceMemberRole !== "ADMIN"){
               return next(new ErrorHandler(400, "First join the board"))
           }
   
           if(boardMemberRole !== "ADMIN"){
               return next(new ErrorHandler(400, "Don't have a permission to create a list"))
           }

           const cards = await Card.find({
              listId: {$in : board.lists.map((list:any) => list._id)}
           }).select("_id name description listId labels comments position color members isComplete")
           .populate({
             path: "members",
             select: "_id username profile",
           }).populate({
             path: "labels",
             select: '_id name color position'
           }).lean();
  

           res.status(200).json({
             lists: board.lists,
             cards: cards.map((card:any) => {
                return {
                   _id: card._id,
                   name: card.name,
                   description: card.description,
                   position: card.position,
                   listId: card.listId,
                   color: card.color,
                   expireDate: card.expireDate,
                   isComplete: card.isComplete,
                   comments: card.comments?.length,
                   members: card.members?.map((member:any) => {
                     return {
                        _id: member._id,
                        username: member.username,
                        profile: member.profile,
                     }
                   })
                }
             })
            
           })

     } catch(error) {
      
        res.status(500).json({success: false, message: "Oops, something went wrong!"})

     }

}




export const deleteList = async (req:any, res:Response, next: NextFunction) => {

     try{
     const {listId} = req.params;

     if(!listId){
      return next(new ErrorHandler(400, "listId is required"))
     }else if(!mongoose.isValidObjectId(listId)){
      return next(new ErrorHandler(400, "listId is not valid"))
     }
    
     //get the delete
     const list = await List.findOne({_id: listId}).select("_id name boardId cards").lean()

     if(!list) {
        return next(new ErrorHandler(404, "List not found"))
     }

     const board = await Board.findOne({_id: list.boardId}).select("_id visibility  workspaceId lists members ")
     .populate({
        path: "workspaceId",
        select: "_id name members"
     })


     //check if the user is boardAdmin or workspaceAdmin
     const boardMemberRole = board?.members.find((member:any) => {
        member.memberId.toString() === req.user._id.toString()
     })?.role

     const workspaceMember = board?.workspaceId.members.find((member:any) => member.memberId.toString() === req.user._id.toString())?.role

     if(!boardMemberRole && !workspaceMember){
         return next(new ErrorHandler(400, "can't delete the list"))
     }

     if(!boardMemberRole && workspaceMember === "NORMAL"){
        return next(new ErrorHandler(400, "can't delete the list"))
     }
     
     if(!boardMemberRole && workspaceMember === "NORMAL" && board?.visibility === "PRIVATE"){
        return next(new ErrorHandler(400, "can't delete the list"))
     }
     

     await List.deleteOne({_id: list._id});
     await Card.deleteMany({_id: {$in: list.cards}});

     await Comments.deleteMany({cardId: {$in : list.cards}});

     board.lists = board.lists.filter((list: any) => list._id.toString() !== list._id.toString())

     await board.save();

      res.status(200).json({success: true, message: "List has been deleted successfully"})

     } catch(error){
         res.status(500).json({success: false, message: "Oops, something went wrong!"})
     }
}




