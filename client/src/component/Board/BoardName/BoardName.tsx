
import React,{useEffect, useState} from 'react'
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import debounce from 'debounce-promise';
import axiosInstance from '../../../http';
import { AxiosError } from 'axios';



interface Props {
  workspaceId: string,
  boardId: string | undefined,
  value: string,
}

function BoardName({workspaceId, boardId, value}: Props) {

  const [name, setName] = useState(value);
  const [lastValue, setLastValue] = useState(value);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  
  const updateName = debounce((newValue:string, boardId:string) => {
    if(newValue !== ""){

       axiosInstance.put(`/boards/${boardId}/name`, {name: newValue})
       .then((response) => {
         
        //invalidate queries

       }).catch((error: AxiosError) => {
          


       })
    }

  }, 500)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      
     const value = e.target.value;
     setName(e.target.value);

     if(value !== ""){
       setLastValue(e.target.value);
       updateName(e.target.value.trim(), boardId);
     }
  }

  const handleBlur = () => {
   if(name === ""){
     setName(lastValue);
   }

  }

  return (

    <input
     className='border-none outline-none max-w-sm  shadow rounded px-2 py-1'
     onChange={(e) => handleChange(e)}
     type="text"
     value={name}
     onBlur = {handleBlur} />
  )
}

export default BoardName