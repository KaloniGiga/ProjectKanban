
import {  AxiosError } from 'axios';
import React, {useState, useEffect} from 'react';
import { HiOutlineCheck } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../../http';

interface Props {
  workspaceId: string,
  boardId: string | undefined,
  options: string[],
  visibility ?: string;
}



function BoardVisibility({workspaceId, boardId, options = [], visibility}: Props) {

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [currentValue, setCurrentValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
     if(options.length > 0){
       const available = options.find((option) => option === visibility);
        
       if(available){
         setCurrentValue(available);
       }else{
         setCurrentValue(options[0]);
       }

      }

     
    
  }, [options])


  const handleChange = (option:string, boardId:string|undefined) => {
      
     
    //  axiosInstance.put(`/boards/${boardId}/visibility`, {visibility: option})
    //  .then((response) => {
       
    //   setShowOptions(false);

    //    queryClient.invalidateQueries(["getRecentBoards"]);
    //    queryClient.invalidateQueries(["getBoard", boardId]);
    //    queryClient.invalidateQueries(["getWorkSpaces"]);
    //    queryClient.invalidateQueries(["getFavorites"]);
    //    queryClient.invalidateQueries(["getWorkSpaceBoards", workspaceId]);
    //    queryClient.invalidateQueries(["getWorkSpaceSettings", workspaceId]);
    //    queryClient.invalidateQueries(["getWorkSpaceMembers", workspaceId]);

    //  }).catch((error: AxiosError) => {
        
    //     if(error.response){
    //         const message = error.response.data;


    //     }
    //  })
  }

  return (

    <div className='text-sm relative'>
      <button
      onClick={() => setShowOptions((prev) => !prev)}
      className="bg-surface px-2 py-1 rounded"
      >
        {currentValue}
      </button>

      {showOptions && (
        <div
        style={{width: '150px'}}
        className='absolute  z-20 top-10 left-0 rounded shadow-lg bg-white'
        >
           <div className='header flex items-center justify-between px-2 py-1  border-b'>
             <h2 className=''></h2>

             <button type='button'
             className='hover:primary_light'
             onClick={() => setShowOptions(false)}>
              <MdClose size={20}/>
              </button>
           </div>

           <div className='options flex flex-col'>
            
             {options.map((option) => (
                   <button
                   onClick={() => handleChange(option, boardId)}
                   className={`px-2 py-1 inline-block hover:bg-primary_light rounded `}
                   >
                    <div className='flex items-center justify-between'>

                    <span>{option}</span>
                    {currentValue === option && <HiOutlineCheck size={20}/>}
                    </div>
                   </button>
             ))}

           </div>
        </div>
      )}
      
    </div>
  )
}

export default BoardVisibility;