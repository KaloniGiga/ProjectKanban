
import { AxiosError } from 'axios';
import React, {useCallback} from 'react'
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../http';
import { hideModal } from '../../redux/features/modalslice';


interface Props {
  workspaceId: string,
  boardId: string
}

function ConfirmDeleteBoardModal({workspaceId, boardId}:Props) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {pathname} = useLocation();

  const deleteBoard = useCallback((boardId:string) => {

    axiosInstance.delete(`/boards/${boardId}`)
    .then((response) => {
      
       queryClient.invalidateQueries(["getRecentBoards"]);
       queryClient.invalidateQueries(["getFavorites"]);
       queryClient.invalidateQueries(["getWorkSpaces"]);
       queryClient.removeQueries(["getBoard", boardId]);
       queryClient.refetchQueries(["getLists", boardId]);

       dispatch(hideModal());

       if(pathname === `/board/${boardId}`){
        navigate(`/workspace/${workspaceId}/boards`, {replace: true})
       }

    }).catch((error: AxiosError) => {
      
      dispatch(hideModal());

      if(error.response){
        const message = error.response.data;

        //invalidate queries according to the statusCode


      }else if(error.request) {

         //add error toast
      }else {

        //add error toast
      }

    })

  }, [workspaceId])

  return (

    <div>
      <h3 className='font-semibold px-4 py-2'>Do you really want to delete the board ?
         You cannot undo the process.</h3>

      <div className='flex jusitfy-end py-2 px-3'>
        <button className='font-md mr-4  rounded bg-secondary hover:bg-black text-white px-3 py-2'
        onClick={() => dispatch(hideModal())}>
          Cancel
        </button>

        <button className='fond-md rounded bg-black hover:bg-secondary text-white px-3 py-2'
         onClick={() => deleteBoard(boardId)}>
          Delete
        </button>

      </div>
    </div>
  )
}

export default ConfirmDeleteBoardModal