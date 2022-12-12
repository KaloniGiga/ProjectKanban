import {Request, Response, NextFunction} from 'express';


export const createBoard = (req:Request, res:Response, next:NextFunction) => {
   try {
     const {workSpaceId, name, color, bgImage, visibility} = req.body;

     
   } catch (error) {
    
   }

}

export const getBoardDetail = async (req:Request, res:Response, next:NextFunction) => {

}

export const updateBoard = async (req:Request, res:Response, next:NextFunction) => {

}

export const  updateBoardVisibility= async (req:Request, res:Response, next:NextFunction) => {

}

export const getRecentlyVisitedBoards = async (req:Request, res:Response, next:NextFunction) => {

}



