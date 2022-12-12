import React from 'react'
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';


interface Props {
  boardId:string | undefined,
  workspaceId: string,
  myRole: string,
}


function BoardLists({boardId, workspaceId, myRole}: Props) {

   const dispatch = useDispatch();
   const queryClient = useQueryClient();
   
   

  return (

    <div>
      
      board lists
    </div>
  )
}

export default BoardLists;