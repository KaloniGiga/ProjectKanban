import React from 'react'
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import {useDrag, useDrop} from 'react-dnd';
import { ListType } from '../../../types/component.types';
import { MdOutlineViewList } from 'react-icons/md';
import List from './List';




interface Props {
  boardId:string | undefined,
  workspaceId: string,
  myRole: string,
}


function BoardLists({boardId, workspaceId, myRole}: Props) {

   const dispatch = useDispatch();
   const queryClient = useQueryClient();
   


  //  get Lists in a board
   const getLists = async() => {

   }
   
   const lists = [{
     _id: String,
     name: String,
     pos: String
   }]

  return (
      lists ? ( 
       <div>
         {lists.map((list) => (
              <List list={list} cards={list.cards} boardId={boardId} workspaceId={workspaceId} role={myRole}/>
         ))}
       </div>
         
      ):(
        <div></div>
      )
  )
}

export default BoardLists;