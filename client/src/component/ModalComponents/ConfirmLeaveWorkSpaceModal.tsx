
import React, {useCallback} from 'react'
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../http';
import { hideModal } from '../../redux/features/modalslice';
import Button from '../button/Button';

interface Props {
  workspaceId: string
}

function ConfirmLeaveWorkSpaceModal({workspaceId}:Props) {
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  
  const leaveWorkSpace = useCallback((workspaceId:string) => {
         
    dispatch(hideModal());

    axiosInstance.delete(`workspace/${workspaceId}/members`)
    .then((response) => {

     //add toast

     //invalidate querires


      navigate('/', {replace: true})
    })
    .catch(() => {
     
    

    })

  }, [])

  return (
    <div className='px-4 py-2'>
         <h1 className='font-semibold text-xl mb-4'>Do your want to leave the WorkSpace?</h1>

         <div className='flex '>
           <Button name='Cancel' 
            classes="hover:bg-black mr-6"
            onClick={() => dispatch(hideModal())}
            />

           <Button name="Leave"
            classes='hover:bg-secondary bg-black'
            onClick={() => leaveWorkSpace(workspaceId)}/>
         </div>

    </div>
  )
}

export default ConfirmLeaveWorkSpaceModal