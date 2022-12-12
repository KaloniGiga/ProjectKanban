
import React, {useCallback} from 'react'
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { hideModal } from '../../redux/features/modalslice';
import Button from '../button/Button';

interface Props {
  workspaceId: string,
  boardId: string,
  memberId: string,
}

function ConfirmRemoveBoardMemberModal({workspaceId, boardId, memberId}: Props) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  const removeBoardMember = useCallback((workspaceId:string, boardId:string, memberId:string) => {
         

  }, [])

  return (
    <div className='px-4 py-2'>
         <h1 className='font-semibold text-xl mb-4'>Do your really want to remove the member from the board ?</h1>

         <div className='flex '>
           <Button name='Cancel' 
            classes="hover:bg-black mr-6"
            onClick={() => dispatch(hideModal())}
            />

           <Button name="Remove"
            classes='hover:bg-secondary bg-black'
            onClick={() => removeBoardMember(workspaceId, boardId, memberId)}/>
         </div>

    </div>
  )
}

export default ConfirmRemoveBoardMemberModal