
import React from 'react'
import { useQuery, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../http';
import BoardList from '../Board/BoardList';
import {  BoardObj } from '../../types/component.types';
import Loader from '../Loader/loader';
import Board from '../Board/Board';
import { RecentBoard } from './recentBoard';

const recentBoards = () => {

  const queryClient = useQueryClient();


    const getRecentBoards = async () => {
       const response = await axiosInstance.get('/recentboard');

       const recentBoards = response.data.boards;
 
       return recentBoards;
    }

    const {isLoading, data:recentBoards, error} = useQuery<BoardObj[]|undefined, any>(["getRecentBoards"], getRecentBoards);

    if(isLoading) {
        return (
            <div className='w-full flex items-center justify-center'>
                <Loader />
            </div>
        );
       
    }

    if(error){
        return (
            <div>
                <h1>Oops! something went wrong...</h1>
                 <button className=''>Retry</button>
            </div>
        )
    }

  return (
    <div className=''>
      {recentBoards && recentBoards.length > 0 ? (
         recentBoards.map((board) => (
            <Board key={board._id} board={board}  workspaceId={board.workSpaceId} />
         ))
      ): (
       <h3 className='text-center mt-2'>No Boards</h3>
      )}
    </div>
  )
}

export default recentBoards;