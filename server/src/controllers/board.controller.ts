import {Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import Board from '../models/board.model';
import WorkSpace from '../models/workspace.model';
import { ErrorHandler } from '../utils/ErrorHandler';
import validator from 'validator';
import { getSpaceDetail } from './workspace.controller';
import Favorite from '../models/favorite.model';
import RecentBoard from '../models/recentBoards.model.';
import {I_WorkSpaceDocument} from '../models/workspace.model'
import Card from '../models/cards.model.';
import List from '../models/list.model';
import Comments from '../models/Comments.model';
import User from '../models/user.model';


export const createBoard = async (req:any, res:Response, next:NextFunction) => {
   try {
     const {workspaceId, name, description, color, bgImage, visibility} = req.body;

     //validate workspaceId
     if(!workspaceId){
       return next(new ErrorHandler(400, "workspaceId is requred"))
     }else if(!mongoose.isValidObjectId(workspaceId)){
       return next(new ErrorHandler(400, "workspaceid is not valid"))
     }
     
     console.log("wokspaceId validate")
     //validate name
     if(!name){
       return next(new ErrorHandler(400, "board name is required"));
     }else if(name.length>50){
       return next(new ErrorHandler(400, "board name should be smaller than 50 characters"));
     }

     console.log("name validated")
     
     if(description && description.length > 255){
      return next(new ErrorHandler(400, "description must be less than 255 chars"))
     }

     console.log("description validated")

    //validate color
    if(color){
      if(color.length !== 7 || color[0] !== "#"){
        return next(new ErrorHandler(400, "color must in hex format"))
      }
    }
   

    //validate background Image
    if(bgImage && !validator.isURL(bgImage)){
       return next(new ErrorHandler(400, "Image URL is invalid"))
    }

    //validate board visibility
    if(visibility && !["PUBLIC", "PRIVATE"].includes(visibility)){
       return next(new ErrorHandler(400, "board visibility must be either private or public"))
    }


    //check if workspace exists or not
    const workspace = await WorkSpace.findOne({_id: workspaceId, members: {$elemMatch: {memberId: req.user._id}}}).select("_id boards");
   
    if(!workspace){
      return next(new ErrorHandler(404, "Workspace not found"))
    }
  
    console.log("workspace found in the database")
    //check the role of the user in current workspace


    //create a board
    const newBoard = new Board({
       name: validator.escape(name),
       workspaceId:  workspaceId,
       creator: req.user._id,
    })


    if(description){
      newBoard.description = validator.escape(description)
    }


    if(bgImage){
       newBoard.bgImage = bgImage
    }

    if(visibility){
       newBoard.visibility = visibility
    }

    console.log("create a new bord")

    //add current user as admin of board
    newBoard.members.push({memberId: req.user._id, role: "ADMIN"})
   console.log("add the creator as board member")
    //add the board to the workspace and save both
    await newBoard.save()

    console.log("save the new board")

    workspace.boards.push(newBoard._id);
    
    await workspace.save();
    console.log("push the board into workspace and save the workspace")

    res.status(200).json({success: true, board: newBoard})


   } catch (error) {

     res.status(500).json({success: false, message: "Oops, something went wrong!"})
   }

}


export const getBoardDetail = async (req:any, res:Response, next:NextFunction) => {

    try{
      const {boardId} = req.params;

      if(!boardId){
        return next(new ErrorHandler(400, "Board id is required"))
      }else if(!mongoose.isValidObjectId(boardId)){
        return next(new ErrorHandler(400, "Invalid board _id"))
      }
       
      console.log("boardId validated")
      //check if the board exist
      const board = await Board.findOne({_id: boardId })
      .populate({path: "members", populate: {path: "memberId", select: "_id username picture"}})
      .populate({path: "workspaceId", select: "_id name members"})
      .lean();

      if(!board){
        return next(new ErrorHandler(404, "Board not found"))
      }

      console.log("find the board having boardId");

      const isFavorite = await Favorite.findOne({resourceId: board._id, userId: req.user._id, type: "BOARD"})
      console.log("check if the board is you favorite board")

      const isMember = board.members.find((member:any) => member.memberId.toString() === req.user._id.toString());
      console.log("check if you are member of that board", isMember)


      //if user is a member of board update his recent board list
      if(isMember){
        const recentBoard = await RecentBoard.findOne({userId: req.user._id, boardId})

        if(recentBoard){
          recentBoard.lastVisited = Date.now();
          await recentBoard.save();
         
        }else {
           const newRecentBoard = new RecentBoard({
              userId: req.user._id,
              boardId: board._id,
           })

           await newRecentBoard.save();
           console.log("added to your recently visited board model")
        }

        res.status(200).json({
          success: true,
          board: {
            _id: board._id,
            name: board.name,
            description: board.description,
            visibility: board.visibility,
            isFavorite: isFavorite ? true : false,
            workspace: {
               _id: board.workspaceId,
               name: board.workspaceId.name,
            },
            color: board.color,
            bgImage: board.bgImage,
            lists: board.lists,
            members: board.members.map((member:any) =>{
              return {
                 _id: member.memberId._id,
                 username: member.memberId.username,
                 picture: member.memberId.picture,
                 role: member.role,
              
              }})        
          }
        })
      }
      
     const workspaceRole = board.workspaceId.members.find((member:any) => {
         member.memberId.toString() === req.user._id.toString()
     })?.role;

     if((workspaceRole !== "ADMIN" && workspaceRole !== "NORMAL") || (workspaceRole === "NORMAL") && board.visibility === "PRIVATE" ){
        
        return next(new ErrorHandler(404, "Board not found"));
     }

    //update the recently visited board for the user
    console.log("you are a member of the workspace and board is public ")

    const recentBoard = await RecentBoard.findOne({
      userId: req.user._id,
      boardId: board._id,
    })
     
   if(recentBoard) {
      recentBoard.lastVisited = Date.now();
      await recentBoard.save();
   }else {
     const newBoard = new RecentBoard({
        userId: req.user._id,
        boardId: board._id,
     })

     await newBoard.save();
   }

   console.log("board added to you recent visited board model")

    res.status(200).json({
       success: true,
       board: {
        _id: board._id,
        name: board.name,
        description: board.description,
        visibility: board.visibility,
        color: board.color,
        bgImage: board.bgImage,
        workspace: {
          _id: board.workspaceId,
           name: board.workspaceId.name
        },
        lists: board.lists,
        isFavorite: isFavorite ? true : false,
        FavoriteId: isFavorite && isFavorite._id,
        members: board.members.map((member:any) => {
           return {
             _id: member._id,
             username: member.username,
             picture: member.picture,
             role: member.role,
             
           }
        })
       }
    })

    }catch(error){
      res.status(500).json({success: false, message: "Oops, something went wrong!"})

    }
}

export const updateBoard = async (req:Request, res:Response, next:NextFunction) => {

}

export const  updateBoardVisibility= async (req:Request, res:Response, next:NextFunction) => {

}

export const getRecentlyVisitedBoards = async (req:any, res:Response, next:NextFunction) => {
   
  try {
      //get the recently visited boards form the database
     const recentBoards = await RecentBoard.find({userId: req.user._id}).select("_id boardId")
     .populate({
      path: "boardId",
      select: "_id name color bgImage workspaceId visibility createdAt",
     })
     .sort({lastVisited: -1}).limit(5).lean();

   
     //find if the boards are starred as favorite or not
    const formattedRecentBoards =  await Promise.all(recentBoards.map(async (board:any) => {
          const isFavorite = await Favorite.findOne({resourceId: board.boardId._id, userId: req.user._id, type: "BOARD"})

          return {
             _id: board.boardId._id,
             name: board.boardId.name,
             color: board.boardId.color,
             isFavorite: isFavorite ? true : false,
             favoriteId: isFavorite && isFavorite._id,
             bgImage: board.boardId.bgImage,
             workspaceId: board.boardId.workspaceId,
             visibility: board.boardId.visibility,
             createdAt: board.boardId.createdAt,
          }
    }))

    res.status(200).json({success: true, boards: formattedRecentBoards})
     
   } catch (error) {
    res.status(500).json({ success: false, message: "Oops, something went wrong!"})
   }
}

export const addBoardMembers = async (req:any, res:Response, next:NextFunction) => {
  
  try {
      
    const {id} = req.params;
    const {members, role} = req.body;
    

    if(!id){
      return next(new ErrorHandler(400, "boardId is required"))
   }else if(mongoose.isValidObjectId(id)){
     return next(new ErrorHandler(400, "Invalid boardID"))
   }


   if(!members){
      return next(new ErrorHandler(400, "Member must not be emepty"))
   }else if(!Array.isArray(members)){
     return next(new ErrorHandler(400, "Members must be any array"))
   }else if(members.find((member:any) => !mongoose.isValidObjectId(member))){
     return next(new ErrorHandler(400, "member must be a valid id"))
   }

   if(!role){
     return next(new ErrorHandler(400, "role is required"))
   }else if(role !== "NORMAL" && role !== "ADMIN"){
     return next(new ErrorHandler(400, "role must be normal or admin"))
   }


   //filter the duplicate from the members array
   let uniqueValues = members.filter((id) => id);

    uniqueValues = uniqueValues.filter((value, index, self) => {
      return self.indexOf(value) === index
   })

   if(uniqueValues.length === 0){
    return next(new ErrorHandler(400, "there must be at least 1 unique value"))
   }

   const board = await Board.findOne({_id: id}).select("_id visibility workspacedId members")
   .populate({
    path: "workspaceId",
    select: "_id name members"
   });


   if(!board){
     return next(new ErrorHandler(400, "Board not found"))
   }


   const boardMemberRole = board.members.find((member:any) => {
      member.memberId.toString() === req.user._id.toString()
   })?.role

   const workspace = await WorkSpace.findOne({_id: board.workspaceId._id}).select("_id members")

   if(!workspace){
    return next(new ErrorHandler(400, "Workspace doesnot exist"));
   }

   const workspaceMemberRole = workspace?.members.find((member:any) => {
      member.memberId.toString() === req.user._id.toString()
   })?.role

   //condition for user is not able to add members
    if(!boardMemberRole && !workspaceMemberRole){
       return next(new ErrorHandler(400, "You can't invite people to this board"));

    }

    if(!boardMemberRole && workspaceMemberRole === "NORMAL" && board.visibility === "PRIVATE"){
       return next(new ErrorHandler(400, "you can't invite people to the board"));
    }


    if(boardMemberRole !== "ADMIN" && boardMemberRole !== "NORMAL"){
       return next(new ErrorHandler(400, "You can't invite people"))
    }

    if(!boardMemberRole && workspaceMemberRole === "NORMAL"){
      return next(new ErrorHandler(400, "You are not a member of a board"))
    }

   //check if the members to add are already the member of board
     uniqueValues = uniqueValues.filter((value:any) => board.members.map((member:any) => member.memberId.toString()).includes(value) );

    //check if the uniqueValues are valid members
    const existingMember = await User.find({_id: {$in : uniqueValues}, emailVerified: true}).select("_id").lean();
    
    const finalMembers = existingMember.map((member:any) => {
        return {
           memberId: member._id.toString(),
           role: role,
        }
    });

    if(finalMembers){
       finalMembers.map((m:any) => board.members.push(m));
    }
  
    //if they are not workspace members, handle them

    await board.save();

    return res.send({
      success: true,
      message: "Members added to the board",
    })

  } catch (error) {
    res.status(500).json({success: false, message: "Oops! something went wrong"})
  }

}





export const updateMemberRole = async (req:any, res:Response, next:NextFunction) => {


}

export const removeMember = async (req:any, res:Response, next:NextFunction) => {


}

export const leaveBoard = async (req:any, res:Response, next:NextFunction) => {


}

export const joinBoard = async (req:any, res:Response, next:NextFunction) => {


}



export const updateBackground = async (req:any, res:Response, next:NextFunction) => {


}

export const createLabel = async (req:any, res:Response, next:NextFunction) => {


}

export const updateLabel = async (req:any, res:Response, next:NextFunction) => {


}

export const removeLabel = async (req:any, res:Response, next:NextFunction) => {


}

export const getAllLabels = async (req:any, res:Response, next:NextFunction) => {


}


export const deleteBoard = async (req:any, res:Response, next:NextFunction) => {

   try {
      const {id} = req.params;

      if(!id){
         return next(new ErrorHandler(400, "boardId is required"))
      }else if(mongoose.isValidObjectId(id)){
        return next(new ErrorHandler(400, "Invalid boardID"))
      }


      const board = await Board.findOne({_id: id})

      if(!board){
        return next(new ErrorHandler(400, "board does not exist"))
      }

      //check if current is board member or a workspace member

      const isboardMember = board.members.find((member:any) => {
         member.memberId.toString() === req.user._id.toString()
      })

      const isWorkspaceMember = board.workspaceId.members.find((member:any) => {
         member.memberId.toString() === req.user._id.toString()
      })

      //check if the user have access to this board
      //case1: if user neither boardmember or a workspace member
      if(!(isboardMember && isWorkspaceMember) ){
           return next(new ErrorHandler(400, "Don't have a permission to access board"))
      }

      //case2: if user is a workspace member but not a boardmember and the board is private
      if(isWorkspaceMember && !isboardMember && board.visibility === "PRIVATE"){
         return next(new ErrorHandler(400, "can't access this board"))
      }


    //case3: if user is not a board admin or a workspace admin
    if(!(isboardMember && isboardMember.role === "ADMIN") && !(isWorkspaceMember && isWorkspaceMember.role === "ADMIN")){

       return next(new ErrorHandler(400, "you don't have permission"))
    }

    //delete all the resources associated to the boards
    const cards = await Card.find({listId: {$in : board.lists} }).select("_id")

    await Board.deleteOne({_id: board._id});
    await List.deleteMany({boardId: board._id})
    
    await Card.deleteMany({listId: {$in : board.lists}})

    await Comments.deleteMany({cardId: {$in: cards}})

    await Favorite.deleteOne({resourceId: board._id, type: "BOARD"})
    
    await RecentBoard.deleteOne({boardId: board._id, userId: req.user._id});
      
    //remove the board from the workspace
    const workspace = await WorkSpace.findOne({_id: board.workspaceId._id}).select("_id boards");
    if(!workspace){
      return next(new ErrorHandler(400, "Workspace not found"))
    }
    
    workspace.boards = workspace.boards.filter((bo:any) => bo.toString() !== board._id.toString())

    await workspace.save();

    res.status(200).json({success: true, message: "board deleted successfully."})

  
   } catch (error) {
     res.status(500).json({success: true, message: "Oops something went wrong!"})
   }
}



