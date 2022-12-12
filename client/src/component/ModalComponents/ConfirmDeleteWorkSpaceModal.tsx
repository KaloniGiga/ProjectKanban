
import React, {useCallback} from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../http';
import { hideModal } from '../../redux/features/modalslice';
import { AxiosError } from 'axios';


interface Props {
  workspaceId: string
}

function ConfirmDeleteWorkSpaceModal({workspaceId}: Props) {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {pathname} = useLocation();

  const deleteWorkSpace = useCallback((workspaceId:string) => {

    axiosInstance.delete(`/workspace/${workspaceId}`)
    .then((response) => {
      

       queryClient.invalidateQueries(["getRecentBoards"]);
       queryClient.invalidateQueries(["getFavorites"]);
       queryClient.invalidateQueries(["getWorkSpaces"]);
       queryClient.invalidateQueries(["getWorkSpaceSettings", workspaceId]);
       queryClient.invalidateQueries(["getWorkSpaceMembers", workspaceId])
       queryClient.invalidateQueries(["getWorkSpaceInfo", workspaceId])
       queryClient.invalidateQueries(["getWorkSpaceBoards", workspaceId])

       dispatch(hideModal());

       if(pathname === `/workspace/${workspaceId}`){
        navigate('/', {replace: true})
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
      <h3 className='font-semibold px-4 py-2'>Do you really want to delete the WorkSpace ?
         You cannot undo the process.</h3>

      <div className='flex jusitfy-end py-2 px-3'>
        <button className='font-md mr-4  rounded bg-secondary hover:bg-black text-white px-3 py-2'
        onClick={() => dispatch(hideModal())}>
          Cancel
        </button>

        <button className='fond-md rounded bg-black hover:bg-secondary text-white px-3 py-2'
         onClick={() => deleteWorkSpace(workspaceId)}>
          Delete
        </button>

      </div>
    </div>
  )
}

export default ConfirmDeleteWorkSpaceModal