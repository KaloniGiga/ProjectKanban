
import { createNextState } from '@reduxjs/toolkit';
import React from 'react'
import { useQuery, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import axiosInstance from '../../../http';
import { BoardObj } from '../../../types/component.types';
import Loader from '../../Loader/loader';
import Board from '../Board';


function WorkSpaceBoards() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const  {id} = useParams();

    if(!id){
      return <div></div>
    }
    
    const getWorkSpaceBoards = async ({queryKey}: any) => {
       const response = await axiosInstance.get(`/workspace/${queryKey[1]}/boards`)
       const data = response.data;

       return data.boards;
    }

    const {isLoading, data, error} = useQuery<BoardObj[] |undefined , any, BoardObj[], string[]>(["getWorkSpaceBoards", id], getWorkSpaceBoards);
  
    if(isLoading) {
        <div className=' h-full w-full flex justify-center items-center'>
            <Loader />
        </div>
    }
  
    if(error){

    }


    return (

    <div className='px-6 py-3'>
       <h1 className='items-center'>Boards</h1>
       
       { data && data.length > 0 ? (

       <div className='mt-6 flex items-center justify-start gap-x-4 gap-y-4 flex-wrap'>

          {data.map((board) => {
            return  <Board key={board._id} board={board} workSpaceId={id}/>
          })}
        
       </div>

       ) : (
          <div className='flex justify-center items-center mt-3'>
            <h1>No boards found</h1>
          </div>
       )}
      
    </div>
  )
}

export default WorkSpaceBoards;