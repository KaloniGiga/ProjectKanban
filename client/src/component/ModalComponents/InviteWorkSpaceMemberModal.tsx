

import { AxiosError } from 'axios';
import debounce from 'debounce-promise';
import React, {useState, useCallback} from 'react'
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../http';
import { hideModal } from '../../redux/features/modalslice';
import { UserObj } from '../../types/component.types';
import AsyncSelect from 'react-select/async'
import Button from '../button/Button';


interface MembersObj {
  members: any[];
}

interface Props {
  workspaceId: string;
}


function InviteWorkSpaceMemberModal({workspaceId}:Props) {
   
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [value, setValue] = useState<MembersObj>({
     members: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
          
     setIsSubmitting(true);

     axiosInstance.put(`workspace/${workspaceId}/members/join`, value)
     .then((res) => {
        const data = res.data;

        //add message toast

        //invalidate getWorkSpace Member
        queryClient.invalidateQueries(["getWorkSpaceMembers", workspaceId])
         
        setIsSubmitting(false)

        //hide Modal
        dispatch(hideModal())
     })
     .catch((error:AxiosError) => {
       
       setIsSubmitting(false);

       if(error.response){
          const data = error.response.data;


       }else if(error.request){
         
        //add toast
       }else {

         //add toast

       }

     })
   }, [workspaceId]);

   

   const searchUser = async (value: string) => {

      if(value) {
         const response = await axiosInstance.get(`/users/search?q=${value}&workspaceId=${workspaceId}`)

         const data = response.data;
         return data;
      }

   }
   
   const delayfetchUsers = useCallback(debounce(searchUser, 300), [workspaceId])

   const fetchUsers = (value: string) => {
         return delayfetchUsers(value);
   }

  return (

    <div style={{minHeight: '15rem'}}>
       <form onSubmit={handleSubmit}>

        <label htmlFor='async-select' className='font-bold mb-5 ml-3 inline-block'>WorkSpace Members</label>
        <AsyncSelect
         isMulti={true}
         autoFocus={true}
         loadOptions={fetchUsers}
         id="async-select"
         name='async-select'
         className='border-2 border-black ml-3 mr-6 rounded text-sm' />
         
         <div className='flex flex-col items-center mt-8'>
           <Button
            name='Invite'
            classes='hover:bg-black w-1/2 mb-2'
            isSubmitting={isSubmitting}
             />

            <button className='w-1/2 bg-black text-white px-5 py-2 rounded hover:bg-secondary'
             onClick={() => dispatch(hideModal())}>Cancel</button>
         </div>
       </form>
      </div>
    
  )
}

export default InviteWorkSpaceMemberModal;