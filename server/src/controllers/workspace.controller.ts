import { Request, Response, NextFunction } from "express";
import WorkSpace from "../models/workspace.model";
import path from "path";
import Favorite from "../models/favorite.model";
import { ErrorHandler } from "../utils/ErrorHandler";
import { checkAllString } from "../utils/misc";
import mongoose from "mongoose";
import validator from "validator";
import User from "../models/user.model";

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

     //new workspace
     const newWorkSpace = new WorkSpace({
        name: validator.escape(name),
        description: validator.escape(description),
        creator: req.user._id,
     });

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

      await newWorkSpace.save();

     res.status(201).json({
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



export const addWorkSpaceMember = async (req:Request, res:Response, next:NextFunction) => {
   
    try {
        const {id} = req.params;
        const {memberId} = req.body;

        if(!id){
            return next(new ErrorHandler(400, "WorkSpace _id is required"));
        }

        if(!memberId){
            return next(new ErrorHandler(400, "MemberId is required."))
        }
        

        
    } catch (error) {
        
    }
}


export const addWorkSpaceMembers= async (req:Request, res:Response, next:NextFunction) => {

}


export const updateMemberRole = async (req:Request, res:Response, next:NextFunction) => {

}

export const deleteMember = async (req:Request, res:Response, next:NextFunction) => {

}

export const leaveWorkSpace = async (req:Request, res:Response, next:NextFunction) => {

}

export const getWorkSpaceSettings = async (req:Request, res:Response, next:NextFunction) => {

}


export const updateWorkSpaceSettings = async (req:Request, res:Response, next:NextFunction) => {

}


export const deleteWorkSpace = async (req:Request, res:Response, next:NextFunction) => {

}