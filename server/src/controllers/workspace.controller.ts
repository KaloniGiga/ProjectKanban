import { Request, Response, NextFunction } from "express";
import WorkSpace from "../models/workspace.model";
import path from "path";
import Favorite from "../models/favorite.model";
import { ErrorHandler } from "../utils/ErrorHandler";
import { checkAllString } from "../utils/misc";
import mongoose from "mongoose";
import validator from "validator";
import User from "../models/user.model";
import { listenerCount } from "process";
import { createDecipheriv } from "crypto";
import Board from "../models/board.model";
import { getRecentlyVisitedBoards } from "./board.controller";
import Label from "../models/Label.model";
import List from "../models/list.model";
import Card from "../models/cards.model.";
import Comments from "../models/Comments.model";
import RecentBoard from "../models/recentBoards.model.";
import {removePicture, savePicture} from '../utils/picture';

//get all workspaces 
export const getAllWorkSpaces = async (req:any, res:Response, next:NextFunction) => {
   
    try{

        const allWorkSpaces = await WorkSpace.find({
            members: {
                $elemMatch: {
                    memberId: req.user._id,
                }
            }
        })
        .select('_id name picture createdAt')
        .sort({createdAt: 1});

      

        const workSpaceObj = allWorkSpaces.map(async (workspace: any) => {

             const favorite = await Favorite.findOne({
                resourceId: workspace._id,
                userId: req.user._id,
                type: "SPACE",
             })

             const role = workspace.members.find((member:any) => {
                 member.memberId.toString() === req.user._id.toString()
             }).role;

             const STATIC_PATH = process.env.STATIC_PATH || "/static";
             const WORKSPACE_PICTURE_DIR_NAME = process.env.WORKSPACE_PICTURE_DIR_NAME || "workspace_icons"

             return {
                _id: workspace._id,
                name: workspace.name,
                role: role,
                isFavorite: favorite ? true : false,
                favoriteId: favorite && favorite._id,
                picture : workspace.picture ? process.env.FULL_BASE_PATH + path.join(STATIC_PATH, WORKSPACE_PICTURE_DIR_NAME, workspace.picture) : undefined,
             }
        });

        res.status(201).json({
            success: true,
            workspaces: await Promise.all(workSpaceObj),
        })

       } catch(err) {
         
        res.status(500).json({
            success: false,
            message: "Oops, something went wrong"
        })


     }
}

//create a workspace
export const createWorkSpace = async (req:any, res:Response, next:NextFunction) => {
   try {
     const {name, description, members} = req.body;

     //validation
     //for name
     if(!name){
        return next(new ErrorHandler(400, "Name is required"))
     }else if(name.length>40){
        return next(new ErrorHandler(400, "WorkSpace Name must be less than 40 characters"));
    }
     
    //for description
    if(!description){
        return next(new ErrorHandler(400, "Description is required."));
    }else if(description.length > 255){
        return next(new ErrorHandler(400, "Description must not be more than 255 characters."));
    }
     
    console.log("name and description validated")
    //for members
    
    let uniqueMemberIds:string[] = [];

    if(members){
        if(!Array.isArray(members) || !checkAllString(members)){

            return next(new ErrorHandler(400, "Members must be an array of user id's"))
        }else if(members.length > 0){
              
            if(members.find((mem) => !mongoose.isValidObjectId(mem))){

                return next(new ErrorHandler(400, "_id's are invalid"));
            }

            //remove the workspace creator id and get unique values.
             uniqueMemberIds = Array.from(new Set(members)).filter((m) => (m !== req.user._id.toString() && m !== ""))
            
        }
    }
    
     console.log("members validated")
     //new workspace
     const newWorkSpace = new WorkSpace({
        name: validator.escape(name),
        description: validator.escape(description),
        creator: req.user._id,
     });

     //new workspace created
     console.log("new workspace created", newWorkSpace)

      if(uniqueMemberIds.length > 0){
         
         const validMembersIds = await User.find({
            _id: {$in : uniqueMemberIds},
            emailVerified: true,
         }).select("_id");

         
         let validFormat = validMembersIds.map((mem) => {
              return {
                 memberId: mem,
                 role: "Normal",
              }
         });

         newWorkSpace.members = validFormat;

      }
     //

     newWorkSpace.members.push({
        memberId: req.user._id,
        role: "Admin",
     });

     console.log("add members to the workspace")

      await newWorkSpace.save();

      console.log("new workspace saved")

    return  res.status(201).json({
        success: true,
        workspace: {
            _id: newWorkSpace._id,
            name: newWorkSpace.name,
            role: "Admin",
            isFavorite: newWorkSpace.isFavorite,
            icon: newWorkSpace.picture,
            boards: []
        }

        
     })

     console.log("response sent to user")

   } catch (error) {
     res.status(500).json({
        success: false,
        message: "Oops, something went wrong!",
     })
   }
}


export const getSpaceDetail = async (req:any, res:Response, next: NextFunction) => {
   try {
      const {id} = req.params;

      if(!id){
        return next(new ErrorHandler(400, "WorkSpace id is required."))
      }

      const workSpace = await WorkSpace.findOne({
        _id: id,
        members: {
            $elemMatch: {
                memberId: req.user._id,
            }
        }
      }).lean().select('_id name picture members description');

      if(!workSpace){
        return next(new ErrorHandler(404, "WorkSpace not found"))
      }

      const favorite = await Favorite.findOne({
        resourceId: workSpace._id,
        userId: req.user._id,
        type : "SPACE",
      })
      
      const role = workSpace.members.find((m:any) => m.memberId.toString() === req.user._id.toString())?.role;
      
      const STATIC_PATH = process.env.STATIC_PATH || "/static";
      const WORKSPACE_PICTURE_DIR_NAME = process.env.WORKSPACE_PICTURE_DIR_NAME || "workspace_icons"
      
        res.status(201).json({
        success: true,
        workSpace: {
            _id: workSpace._id,
            name: workSpace.name,
            description: workSpace.description,
            picture: workSpace.picture ? process.env.FULL_BASE_PATH + path.join(STATIC_PATH, WORKSPACE_PICTURE_DIR_NAME, workSpace.picture) : undefined,
            role: role,
            isFavorite: favorite ? true : false,
            favoriteId: favorite && favorite._id
        }
      });

   } catch (error) {
       
    res.status(500).json({
        success: false,
        message: "Oops, Something went wrong!"
    })
   }
};


export const getMyWorkSpaces = async (req:any, res:Response, next:NextFunction) => {
    try {
        const myWorkSpaces = await WorkSpace.find({
            members: {
                $elemMatch: {
                    memberId: req.user._id,
                    role: {$in : ['Admin', 'Normal']}
                }
            }
        }).select('_id name');

        res.status(201).json({
            success: true,
            myWorkSpaces
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Oops, Something went wrong!"
        })
    }
}

export const getWorkSpaceBoard = async (req:any, res:Response, next:NextFunction) => {
    try {
        const {id} = req.params;

        if(!id){
         return next(new ErrorHandler(400, "Workspce id is required!"));
        }

        const workSpace = await WorkSpace.findOne({
            _id: id,
            members: {
                $elemMatch: {
                    memberId: req.user._id
                },
            },
        }).lean().select("_id members boards").populate({
            path: "boards",
            select: "_id name color members visibility createdAt",
        });

        if(!workSpace){
            return next(new ErrorHandler(404, "WorkSpace not found!"))
        }

        let boards:any[] = [];
        
        const role = workSpace.members.find((m:any) => m.memberId.toString() === req.user._id.toString())?.role;
        
        const myBoards = workSpace.boards.filter((board: any) => 
           board.members.map((m: any) => m.memberId.toString()).includes(req.user._id.toString())
        );

        const notMyBoards = workSpace.boards.filter((board: any) => 
           !myBoards.map((b:any) => b._id.toString()).includes(board._id.toString())
        );


        if(role === 'Admin'){

            const totalBoards = [
                ...(await Promise.all(
                    myBoards.map(async (board:any) => {
                        const favorite = await Favorite.findOne({
                            resourceid: board._id,
                            userId: req.user._id,
                            type: "BOARD",
                        });

                        return {
                            _id: board._id,
                            name: board.name,
                            color: board.color,
                            isMember: true,
                            role: board.members.find((m:any) => m.memberId.toString() === req.user._id.toString()).role,
                            visiblility: board.visibility,
                            isFavorite: favorite ? true : false,
                            FavoriteId: favorite && favorite._id,
                            createdAt: board.createdAt,
                        };
                    })
                )),

                ...(await Promise.all(
                    notMyBoards.map(async (board:any) => {
                        const favorite = await Favorite.findOne({
                            resourceId: board._id,
                            userId: req.user._id,
                            type: 'BOARD',
                        });


                        return {
                            _id: board._id,
                            name: board.name,
                            isMember: false,
                            visibility: board.visibility,
                            isFavorite: favorite ? true : false,
                            favoriteid: favorite && favorite._id,
                            color: board.color,
                            role: "Admin",
                            createdAt: board.createdAt,
                        };
                    })
                )),
            ].sort((a:any, b:any) => {
                 
                return (a.createdAt === b.createdAt) ? 0 : 
                (a.createdAt < b.createdAt) ? -1 : 1;
            });

            boards = totalBoards;

        }else if(role === "Normal") {

            const totalBoards = [
                 ...(await Promise.all(
                    myBoards.map(async (board:any) => {
                        const favorite = await Favorite.findOne({
                            resourceId: board._id,
                            userid: req.user._id,
                            type: "BOARD",
                        })

                        return {
                            _id: board._id,
                            name: board.name,
                            isMember: true,
                            visibility: board.visiblility,
                            favorite: favorite ? true : false,
                            favoriteId: favorite && favorite._id,
                            color: board.color,
                            createAt: board.createAt,
                            role: board.members.find((m:any) => m.memberId.toString() === req.user._id.toString()).role,
                        };
                    })
                 )),

                 ...(await Promise.all(
                    notMyBoards.filter((board:any) => board.visiblility === "PUBLIC")
                    .map(async (board:any) => {
                        const favorite = await Favorite.findOne({
                            resourceId: board._id,
                            userId: req.user._id,
                            type: "BOARD"
                        });

                        return {
                            _id: board._id,
                            name: board.name,
                            isMember: false,
                            visibility: board.visibility,
                            color: board.color,
                            isFavorite: favorite ? true : false,
                            favoriteId: favorite && favorite._id,
                            role: "Normal",
                            createdAt: board.createdAt,
                        }
                    })
                 ))
            ].sort(function (a:any, b:any){

                return (a.createdAt === b.createdAt) ? 0 : 
                (a.createdAt < b.createdAt) ? -1 : 1;
            });

            boards = totalBoards;

        }else if(role === "Guest"){
           
           const totalBoards = [
              ...(await Promise.all(
                 myBoards.map(async (board:any) => {
                     
                    const favorite = await Favorite.findOne({
                        resourceId: board._id,
                        userId: req.user._id,
                        type: "BOARD"
                 });

                  return {
                    _id: board._id,
                    name: board.name,
                    isMember: true,
                    color:board.color,
                    visibility: board.visibility,
                    isFavorite: favorite ? true : false,
                    favoriteId: favorite && favorite._id,
                    createAt: board.createdAt,
                    role: board.members.find((m:any) => m.memberId.toString() === req.user._id.toString()).role,
                  };
                 })
              )),
           ]

           boards = totalBoards;

        }

        res.status(201).json({
            success: true,
             boards,
       })
        
    }catch(error) {
        res.status(500).send({
            success: false,
            message: "OOps , something went wrong."
        })
    }
}


export const getAllWorkSpaceMembers = async (req:any, res:Response, next:NextFunction) => {
       
    try{
     const {id} = req.params;

     if(!id){
        return next(new ErrorHandler(400, "Workspace id is required!"))
     }

    const workSpace = await WorkSpace.findOne({
         _id: id,
         members: {
            $elemMatch: {
                memberId: req.user._id,
            },
         },
     })
     .select("_id name members")
     .populate({
        path: "members",
        populate: {
        path: "memberId",
        select: "_id username avatar",
        },
     }).lean();

     if(!workSpace){
        return next(new ErrorHandler(404, "WorkSpace not found"));
     }


     const role = workSpace.members.find((m:any) => m.memberId._id.toString() === req.user._id.toString())?.role;

     if(role === "Guest"){
         return next(new ErrorHandler(403, "Your don't permission."))
     }

     const arrangedMember = workSpace.members.sort(function (a:any, b:any) {
             
        return (b.createdAt === a.createdAt) ? 0 : (b.createdAt < a.createdAt) ? 1 : -1;
     });


     const FULL_BASE_PATH = process.env.FULL_BASE_PATH;
     const STATIC_PATH = process.env.STATIC_PATH || "/static";
     const PROFILE_PICS_DIR_NAME = process.env.PROFILE_PICS_DIR_NAME || "profile_pics";

     const finalMembersList = [
        ...(arrangedMember.filter((m:any) => m.role === "Admin")),
        ...(arrangedMember.filter((m:any) => m.role === "Normal")),
        ...(arrangedMember.filter((m:any) => m.role === "Guest")),
     ].map((mem:any) => {
         
         return {
             _id: mem.memberId._id,
             username: mem.memberId.username,
             avatar: mem.memberId.profile && FULL_BASE_PATH + path.join(STATIC_PATH, PROFILE_PICS_DIR_NAME, mem.memberId.avatar),
             role: mem.role,
         }
     })

     res.status(200).json({
        success: false,
        finalMembersList,
     })

    }catch(error){
        res.status(500).json({success: false, message: "Oops, something went wrong!"})
    }
     
}



export const addWorkSpaceMember = async (req:any, res:Response, next:NextFunction) => {
   
    try {
        const { id } = req.params;
        const { memberId } = req.body;
    
        if (!id) {
          return next(new ErrorHandler(400, "workspaceid is required"));
        } else if (!mongoose.isValidObjectId(id)) {
          return next(new ErrorHandler(400, "Invalid WorkSpaceId"));
        }
    
        if (!memberId) {
          return next(new ErrorHandler(400, "memberId is required"));
        } else if (!mongoose.isValidObjectId(memberId)) {
          return next(new ErrorHandler(400, "Invalid MemberId"));
        }

        const workspace = await WorkSpace.findOne({
            _id: id,
            members: { 
                $elemMatch: {
                memberId: req.user._id,
            }}
        }).select("_id members")

        if(!workspace){
            return next(new ErrorHandler(404, "Workspace not found"))
        }
       
        const role = workspace.members.find((member:any) => member.memberId.toString() === req.user._id.toString())?.role;

        if(role !== "ADMIN"){
            return next(new ErrorHandler(403, "You don't have permission bro!"))
        }
          
        //check if member already exists
        const memberExist = workspace.members.find((member:any) => member.memberId.toString() === memberId);
        //if member exist and not a guest
        if(memberExist && memberExist.role !== "GUEST"){
            return next(new ErrorHandler(400,"Member already exists."))
        }
        
        //if member exist but is a guest
        if(memberExist && memberExist.role === "GUEST"){
            //change the role to NORMAL

            workspace.members.map((member:any) => {
                if(member.memberId.toString() === memberId){
                    member.role = "NORMAL"
                    return member;
                }

                return member;
            })
            await workspace.save();

            return res.status(200).json({success: true, message: "Member added succesfully"})
        }

        //check if member is registered and verified
        const member = await User.findOne({_id: memberId, emailVerified: true});

        if(!member){
            return next(new ErrorHandler(400, "memberId doesn't exist"))
        }

        //if member is valid
        workspace.members.push({memberId: member._id, role: "NORMAL"})

        await workspace.save();

        res.status(200).json({success: true, message: "Member added successfully"})

        
    } catch (error) {
        res.status(500).json({success: false, message: "Oops something went wrong!"})
    }
}


// export const addWorkSpaceMembers= async (req:any, res:Response, next:NextFunction) => {
    
//     try {
//         const { id } = req.params;
//         const { memberIds } = req.body;
    
//         //validation
//         if (!id) {
//           return next(new ErrorHandler(400, "workspaceid is required"));
//         } else if (!mongoose.isValidObjectId(id)) {
//           return next(new ErrorHandler(400, "Invalid WorkSpaceId"));
//         }
    
//         if (!memberIds) {
//           return next(new ErrorHandler(400, "memberIds is required"));
//         } else if (!mongoose.isValidObjectId(memberIds.find((memberId:any) => !mongoose.isValidObjectId(memberId)))) {
//           return next(new ErrorHandler(400, "Invalid MemberIds"));
//         }else if(!Array.isArray(memberIds) ){
//             return next(new ErrorHandler(400, "memberIds should be an array"));
//         }

//         //member ids can be duplicate, so select unique ids
//         let uniqueMemberIds = memberIds.filter((value, index, self) => {
//              return self.indexOf(value) === index;
//         })

//         uniqueMemberIds = uniqueMemberIds.filter((uniqueMemberId) => uniqueMemberId);
        
//         if(uniqueMemberIds.length === 0){
//             return next(new ErrorHandler(400, "There must be at least one uniqueMemberIds"))
//         }
//         const workspace = await WorkSpace.findOne({
//             _id: id,
//             members: { 
//                 $elemMatch: {
//                 memberId: req.user._id,
//             }}
//         }).select("_id members")

//         if(!workspace){
//             return next(new ErrorHandler(404, "Workspace not found"))
//         }
       
//         const role = workspace.members.find((member:any) => member.memberId.toString() === req.user._id.toString())?.role;

//         if(role !== "ADMIN"){
//             return next(new ErrorHandler(403, "You don't have permission bro!"))
//         }
          
//         //check if member already exists
//         const memberExist = workspace.members.find((member:any) => member.memberId.toString() === memberId);
//         //if member exist and not a guest
//         if(memberExist && memberExist.role !== "GUEST"){
//             return next(new ErrorHandler(400,"Member already exists."))
//         }
        
//         //if member exist but is a guest
//         if(memberExist && memberExist.role === "GUEST"){
//             //change the role to NORMAL

//             workspace.members.map((member:any) => {
//                 if(member.memberId.toString() === memberId){
//                     member.role = "NORMAL"
//                     return member;
//                 }

//                 return member;
//             })
//             await workspace.save();

//             return res.status(200).json({success: true, message: "Member added succesfully"})
//         }

//         //check if member is registered and verified
//         const member = await User.findOne({_id: memberId, emailVerified: true});

//         if(!member){
//             return next(new ErrorHandler(400, "memberId doesn't exist"))
//         }

//         //if member is valid
//         workspace.members.push({memberId: member._id, role: "NORMAL"})

//         await workspace.save();

//         res.status(200).json({success: true, message: "Member added successfully"})

//     }catch(err){
//        res.status(500).json({success: false, message: "Oops, something went wrong!"})
//     }

// }


export const updateMemberRole = async (req:any, res:Response, next:NextFunction) => {
     try{
       const {id, memberId} = req.params;
       const {newRole} = req.body;

       if (!id) {
        return next(new ErrorHandler(400, "workspaceid is required"));
      } else if (!mongoose.isValidObjectId(id)) {
        return next(new ErrorHandler(400, "Invalid WorkSpaceId"));
      }
  
      if (!memberId) {
        return next(new ErrorHandler(400, "memberId is required"));
      } else if (!mongoose.isValidObjectId(memberId)) {
        return next(new ErrorHandler(400, "Invalid MemberId"));
      }

      if(!newRole){
        return next(new ErrorHandler(400, "newRole is required"))
      }else if(!["ADMIN", "NORMAL"].includes(newRole)){
        return next(new ErrorHandler(400, "A member cannot have other roles"))
      }

      const workspace = await WorkSpace.findOne({
          _id: id,
          members: { 
              $elemMatch: {
              memberId: req.user._id,
          }}
      }).select("_id members")

      if(!workspace){
          return next(new ErrorHandler(404, "Workspace not found"))
      }
     
      const role = workspace.members.find((member:any) => member.memberId.toString() === req.user._id.toString())?.role;

      if(role !== "ADMIN"){
          return next(new ErrorHandler(403, "You don't have permission bro!"))
      }

       //check if memeber is valid
       const memberToBePromoted = workspace.members.find((member:any) => member.memberId.toString() === memberId);
       
      if(!memberToBePromoted){
         return next(new ErrorHandler(400, "Member doesnot exist"))
      }

      //check if you are trying to change your role and you are the only admin
      if(memberToBePromoted.memberId.toString() === req.user._id.toString()
         && workspace.members.filter((member:any) => member.role === "ADMIN").length === 1
         && newRole !== "ADMIN"
      ){
        return next(new ErrorHandler(400, "A workspace must have at least one admin"))
      }

      
      workspace.members = workspace.members.map((member:any) => {
          if(member.memberId.toString() === memberToBePromoted.memberId.toString()){
              member.role = newRole;
              return member
          }
          return member;
      })

      await workspace.save();

     return res.status(200).json({success: true, message: "Member role updated successfully"})

     }catch(err){

         return res.status(500).json({success: false, message: "Member updated successfuly"});
     }
}

export const deleteMember = async (req:any, res:Response, next:NextFunction) => {

try{
    const {id, memberId} = req.params;

    if(!id){
      return next(new ErrorHandler(400, "Workspaceid is required"));
    }else if(!mongoose.isValidObjectId(id)){
      return next(new ErrorHandler(400, "workspaceid is not valid"))
    }
    
    if(!memberId){
        return next(new ErrorHandler(400, "memberId is requried"))
    }else if(!mongoose.isValidObjectId(memberId)){
        return next(new ErrorHandler(400, "Invalid memberId"))
    }

    const workspace = await WorkSpace.findOne({
      _id: id,
       members: {
          $elemMatch: {
              memberId: req.user._id,
          }
       }
    }).select("_id members boards");

    
  if(!workspace){
      return next(new ErrorHandler(404, "workspace not found"))
  }

  const role = workspace.members.find((member:any) => member.memberId.toString() === req.user._id.toString())?.role;

  if(role !== "ADMIN" ){
     return next(new ErrorHandler(403, "you don't have permission to remove members."))
  }

   
  const memberToBeDeleted = workspace.members.find((member:any) => member.memberId.toString() === memberId);

  if(!memberToBeDeleted){
    return next(new ErrorHandler(400, "Member doesnot exist"))
  }
  
  //if member you want to delete is you , return error
   if(memberToBeDeleted.memberId.toString() === req.user._id.toString()){
     return next(new ErrorHandler(400, "Can't delete youself."))
   }

   //get all the board in workspace in which memberToBe Deleted is member.
   const boards = await Board.find({
     _id: {$in : workspace.boards}, 
     members: {$elemMatch: {
        memberId: memberToBeDeleted.memberId
    }}}).select("_id members lists");

    //loop over every board the memberToBeDeleted is part of 
    for(const board of boards){
        //find admin of every board
        const adminMember = board.members.filter((member:any) => member.role === "ADMIN")
         //if memberToBeDeleted is only admin of the board, make the workspace admin who is deleting new board admin.
        if(adminMember.length === 1 && adminMember[0].memberId.toString() === memberToBeDeleted.memberId.toString() ){
           
            board.members = board.members.map((member:any) => {
                if(member.memberId.toString() === memberToBeDeleted.memberId.toString()){
                    return {
                        memberId: req.user._id,
                        role: 'ADMIN'
                    }
                }

                return member;
            })

            await board.save();

        }else {

            board.members = board.members.filter((member:any) => {
               member.memberId.toString() !== memberToBeDeleted.memberId.toString()
            });

            await board.save();
        }
         //delete memberToBeDeleted from all cards
        await Card.updateMany({listId: {$in : board.lists}}, {$pull: {members:  memberToBeDeleted.memberId}})

       
    } 

     //delete memberToBeDeleted from workspace
     workspace.members.filter((member:any) => member.memberId.toString() !== memberToBeDeleted.memberId.toString());

     await workspace.save();

     res.status(200).json({success: true, message: "member deleted successfully"})

}catch(err){

    res.status(500).json({success: false, message: "Oops somethig went wrong"})
}
}




export const leaveWorkSpace = async (req:any, res:Response, next:NextFunction) => {
    try{
      const {id} = req.params;

      if(!id){
        return next(new ErrorHandler(400, "Workspaceid is required"));
      }else if(!mongoose.isValidObjectId(id)){
        return next(new ErrorHandler(400, "workspaceid is not valid"))
      }

      const workspace = await WorkSpace.findOne({
        _id: id,
         members: {
            $elemMatch: {
                memberId: req.user._id,
            }
         }
      }).select("_id members boards");

      
    if(!workspace){
        return next(new ErrorHandler(404, "workspace not found"))
    }

    const role = workspace.members.find((member:any) => member.memberId.toString() === req.user._id.toString())?.role;

    if(role !== "ADMIN" && role !== "NORMAL"){
       return next(new ErrorHandler(403, "Please leave the board manually."))
    }

    const workspaceAdmins = workspace.members.filter((member:any) => member.role === "ADMIN");

    if(workspaceAdmins.length === 1 && workspaceAdmins[0].memberId.toString() === req.user._id.toString()){

        return next(new ErrorHandler(403, "you don't have permission to leave"))
    }
     
    const boards = await Board.find({
        _id: { $in: workspace.boards },
        members: {
            $elemMatch: {
                memberId: req.user._id,
            },
        },
    }).select("_id members");
    
    if(boards.length > 0){
        workspace.members = workspace.members.map((member:any) => {
            if(member.memberId.toString() === req.user._id.toString()){
                member.role = "GUEST";
                return member;
            }
            return member;
        })
    }

    await workspace.save();

    res.status(200).json({success: true, message: "leaved the workspace successfully"})
    }catch(err){
      
        res.status(500).json({success: false, message: "Oops! something went wrong!"})
    }
}

export const getWorkSpaceSettings = async (req:any, res:Response, next:NextFunction) => {
    try{
        const {id} = req.params;

        if(!id){
            return next(new ErrorHandler(400, "WorkspaceId is requred."))
        }else if(!mongoose.isValidObjectId(id)){
            return next(new ErrorHandler(400, "Invalid workspaceId"));
        }


        const workspace = await WorkSpace.findOne({
            _id: id,
            members: {
                $elemMatch: {
                    memberId: req.user._id,
                },
            },
        })
        .lean()
        .select("_id name description picture");

        if(!workspace){
            return next(new ErrorHandler(404, "WorkSpace not found!"))
        }

        const role = workspace.members.find((member:any) => member.memberId.toString() === req.user._id.toString())?.role;

        if(role !== "ADMIN" && role !== "NORMAL"){
             return next(new ErrorHandler(403, "Permission not granted."))
        }

        res.status(200).json({
            success: true,
            workspaceSetting: workspace
        })
        
    }catch(err) {
        res.status(500).send({
            success: false,
            message: "Oops, somethng went wrong!"
        });
    }
};


export const updateWorkSpaceSettings = async (req:any, res:Response, next:NextFunction) => {
     try{
        const {id} = req.params;
        const {name, description} = req.body;
        const picture = req.file;

        //validation
        if(!id){
            return next(new ErrorHandler(400, "workspaceId is required"))
        }else if(!mongoose.isValidObjectId(id)) {
           return next(new ErrorHandler(400, "Invalid workspaceId"))
        }
        
        if(!Object.keys(req.body).includes("name") && !Object.keys(req.body).includes("description") && !picture){
            return next(new ErrorHandler(400, "At least one field is required"))
        }

        if(!name){
            return next(new ErrorHandler(400, "Workspace name cannot be empty."))
        }else if(name.length > 50){
            return next(new ErrorHandler(400, "Workspace name must be less than or equal to 50"))
        }

        if(description && description.length > 255){
            return next(new ErrorHandler(400, "Character length for description exceeded."))
        }


        const workspace = await WorkSpace.findOne({
            _id: id,
            members: {
                $elemMatch: {
                    memberId: req.user._id,
                }
            }
        }).select("_id picture members")


        if(!workspace){
            return next(new ErrorHandler(404, "Workspace not found"))
        }
          
        const role = workspace.members.find((member:any) => member.memberId.toString() === req.user._id.toString())?.role;
       
        if( role !== 'ADMIN'){
            return next(new ErrorHandler(403, "You don't have permission to change settings"))
        }

        //update information manually
        if(name){
           workspace.name = validator.escape(name);
        }

        if(Object.keys(req.body).includes("description")){
            workspace.description = validator.escape(description);
        }

        // if(picture){
        //    if(workspace.picture){
        //      await removePicture(path.join(process.env.PUBLIC_DIR_NAME!, process.env.WORKSPACE_PICTURE_DIR_NAME!, workspace.picture))
        //    }

        //    const fileName = await savePicture()

        //    workspace.picture = fileName;
        // }

        await workspace.save();

        return res.status(200).json({success: true, message: "WorkSpace updated successfully"})
     }catch(err){
        res.status(500).json({success: false, message: "Oops, something went wrong!"})
     }
}


export const deleteWorkSpace = async (req:any, res:Response, next:NextFunction) => {
     
    try{
        const {id} = req.params;

        // validate workspace id
        if(!id){
            return next(new ErrorHandler(400, "workspaceId is required"))
        }else if(!mongoose.isValidObjectId(id)){
            return next(new ErrorHandler(400, "Invalid workspaceId"))
        }
        // get the workspace from the database
        const workspace = await WorkSpace.findOne({_id: id}).select("_id members boards picture");

        if(!workspace){
            return next(new ErrorHandler(404, "Workspace not found"))
        }
      
        //check if the user is the admin of the workspace or not
        const workspaceMember = workspace.members.find((member:any) => member.memberId.toString() === req.user._id.toString());

        if(!workspaceMember){
            return next(new ErrorHandler(404, "User is not a member of workspace"))
        };

        if(workspaceMember.role !== "ADMIN"){
            return next(new ErrorHandler(403, "User don't have a permission to delete this workspace."))
        }
        
        //delete all the boards, list , cards connected to workspace
        //Get all the listId and CardsId associated with boards in the workspace
        const lists = await List.find({boardId: {$in : workspace.boards}}).select("_id")

        const cards = await Card.find({listId: {$in : lists}}).select("_id");

        //delete all the resources associated with the workspace
        await WorkSpace.deleteOne({_id: id});
        await Board.deleteMany({_id: {$in: workspace.boards} });
        await List.deleteMany({_id: {$in: lists}})
        await Card.deleteMany({_id: {$in: cards}});

        await Label.deleteMany({boardId: {$in: workspace.boards}});
        await Comments.deleteMany({cardId: {$in: cards}});
        await RecentBoard.deleteMany({boardId: {$in: workspace.boards}, userId: req.user._id})
        await Favorite.deleteOne({favoriteId: workspace._id, type: "WORKSPACE"})
        await Favorite.deleteMany({favoriteId: {$in: workspace.boards}, type: "BOARD" })

        //delete the icon picture of the workspace
        if(workspace.picture){
        
        }

        return res.status(200).send({
            success: true,
            message: "WorkSpace deleted successfully",
            
        })
    }catch(err) {
        res.status(500).send({
            success: false,
            message: "Oops, something went wrong!"
        })
    }
}