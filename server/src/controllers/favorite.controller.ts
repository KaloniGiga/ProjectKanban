import { errorMonitor } from "events";
import {Response, NextFunction } from "express-serve-static-core"
import mongoose from "mongoose";
import Board from "../models/board.model";
import Favorite from '../models/favorite.model';
import WorkSpace, { I_WorkSpaceDocument } from "../models/workspace.model";
import { ErrorHandler } from "../utils/ErrorHandler";





export const getFavorites = async (req: any, res:Response, next: NextFunction) => {
   
    try{

       const myFavorites = await Favorite.find({userId: req.user._id});
       
       //make a list of favorite workspace and boards
       const Favworkspace = myFavorites.filter((fav:any) => fav.type === "WORKSPACE").map((fav:any) => fav.resourceId);
       const Favboard = myFavorites.filter((fav:any) => fav.type === "BOARD").map((fav:any) => fav.resourceId);

       //Although we have handled the usecases when the user is not the member of not authorized to access the resource,
       // we 'll double check here.

       //filter the workspace that exists 
       const favoriteWorkspace = await WorkSpace.find({_id: {$in: Favworkspace.map((favorite:any) =>  favorite.resourceId)}}).lean().select("_id name members visibility");
     
       //filter the board that exists
       const favoriteBoard = await Board.find({ _id: {$in: Favboard.map((favorite:any) => favorite.resouceId)}}).lean().select("_id name color members visibility workspaceId")
       .populate({
        path: "workspaceId",
        select: "_id name members"
       })

       
      //check if the user is member of the workspace

      const finalWorkspace = favoriteWorkspace.filter((workspace:any) => workspace.members.find((member:any) => member.memberId.toString === req.user._id.toString()) || workspace.visibility === "PUBLIC" )
       
      const finalBoards = favoriteBoard.filter((board) => {
          board.members.find((member:any) => member.memberId.toString() === req.user._id.toString()) || 
          (
          board.workspaceId.members.find((member:any) => member.memberId.toString() === req.user._id.toString())?.role === "ADMIN" 
          && board.visibility === "PRIVATE"
          ) ||
         (board.visibility === "PUBLIC" && board.workspaceId.visibility === "PUBLIC")
         ||
         (board.workspaceId.members.find((member:any) => member.memberId.toString() === req.user._id.toString()) && board.workspaceId.visibility === "PRIVATE" && board.visibility === "PUBLIC")
      });


      const allFavorites = [ ...finalWorkspace, ...finalBoards ];

      return res.status(200).json({success: true, favrites: allFavorites});
        
    }catch(error) {
        
      res.status(500).json({success: false, message: "Oops! something went wrong!"})
    }
}






export const addToFavorites = async (req: any, res:Response, next: NextFunction) => {
   
    try {
        const {resourceId, type} = req.body;
        
        //validate the request body
        if(!resourceId){
           return next(new ErrorHandler(400, "resouceId is required"))
        }else if(!mongoose.isValidObjectId(resourceId)){
            return next(new ErrorHandler(400, "Invalid resourceId"))
        }

        if(!type){
            return next(new ErrorHandler(400, "resourceType is required"))
        }else if(!["BOARD", "WORKSPACE"].includes(type)){
            return next(new ErrorHandler(400, "type is not supported"))
        }

        //check for the resourceId
        if(type === "WORKSPACE"){
            const workspace = await WorkSpace.findOne({
                _id: resourceId
            }).lean().select("_id members name visibility")

            if(!workspace){
                return next(new ErrorHandler(404, "workspace not found"))
            }

        //check if the current user is a member of the workspace
          const isMember = workspace.members.find((member:any) => member.memberId.toString() === req.user._id.toString())

          if(!isMember && workspace.visibility === "PRIVATE"){
              return next(new ErrorHandler(400, "You are not authorized to star the resource"))
          }

          //check if the current user has already starred the workspace
           const isAlreadyStarred = await Favorite.findOne({
              resourceId: workspace._id,
              type: "WOKRSPACE",
              userId: req.user._id
           })

           if(isAlreadyStarred){
              return next(new ErrorHandler(400, "workspace is already is in your favorite list"))
           }

           //now that this workspace is public and you don't have starred it
           //add it to your favorite list

           const favorite = new Favorite({resourceId: workspace._id, type: "WORKSPACE", userId: req.user._id})
           
           await favorite.save()

           return res.status(200).json({
            success: true, 
            favoriteWorkspace: {
                _id: favorite._id,
                resourceId: workspace._id,
                name: workspace.name,
                type: "WORKSPACE",
                visibility: workspace.visibility,
            
            }
        });
        }
      
        //else it is a board
        //check if the board exist
        const board = await Board.findOne({_id: resourceId}).select("_id name members color members visibility workspaceId")
        .populate({
            path: "workspaceId",
            select: "_id members visibility"
        })

        if(!board) {
            return next(new ErrorHandler(404, "Board not found"))
        }

        //check if user is a board member
        const isMember = board.members.find((member:any) => member.memberId.toString() === req.user._id.toString() )
        //check if user is a workspace admin
        const isWorkspaceAdmin = board.workspaceId.members.find((member:any) => member.memberId.toString() === req.user._id.toString())?.role
       
        if(!isMember && board.visibility === "PRIVATE" && !isWorkspaceAdmin){
              return next(new ErrorHandler(400, "Board not found"))
        }

        //check if board is already added to favorite list
        const isAlreadyStarred = await Favorite.findOne({resourceId: board._id, type: "BOARD", userId: req.user._id});
        
        if(isAlreadyStarred){
            return next(new ErrorHandler(400, "Board already added to favorite"))
        }

        //if you reach here 
        //add the board to the favorite list
        const favorite = new Favorite({resourceId: board._id, userId: req.user._id, type: "BOARD"});

        await favorite.save()
        
        return res.status(201).json({
            success: true,
            favoriteBoard: {
                _id: favorite._id,
                name: board.name,
                resourceId: board._id,
                workspaceId: board.workspaceId,
                type: "BOARD",
                visibility: board.visibility,
                color: board.color
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Oops! Something went wrong."
        })
    }
}





export const removeFavorite = async (req: any, res:Response, next: NextFunction) => {
          
    try {
        const {resourceId, type} = req.body;

        if(!resourceId){
            return next(new ErrorHandler(400, "resourceId is requried"))
        }else if(!mongoose.isValidObjectId(resourceId)){
            return next(new ErrorHandler(400, "resourceId is invalid"))
        }

        if(!type){
            return next(new ErrorHandler(400, "type is required"))
        }else if(!["WORKSPACE", "BOARD"].includes(type)){
            return next(new ErrorHandler(400, "invalid type"));
        }

        //check the favourite 

        const favorite = await Favorite.findOne({resourceId: resourceId, type: type, userId: req.user._id});

        if(!favorite){
            return next(new ErrorHandler(400, "first add the resource to the favorite list"))
        }

        await Favorite.deleteOne({_id: favorite._id, userId: req.user._id});

        res.status(200).json({success: true, message: "Removed from favorites list successfully"})
        
    } catch (error) {

        res.status(500).json({success: false, message: "Oops! something went wrong!"})
    }
}