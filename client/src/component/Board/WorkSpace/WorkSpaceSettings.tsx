
 
 import React, { useState } from 'react'
import { QueryClient, useQuery, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import axiosInstance from '../../../http';
import { SettingsObj, WorkSpaceContext } from '../../../types/component.types';
 



 function WorkSpaceSettings() {
 
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const {workSpaceId, myRole} = useOutletContext<WorkSpaceContext>();

    if(myRole !== "ADMIN" && myRole !== "NORMAL"){

        return <div className='w-full h-full justify-center items-center'>
           <p> You don't have permission to see settings.</p>
            
             </div>
    }

      const [isSubmitting, setIsSubmitting] = useState();

      const handleSubmit = () => {


      }
       

      const getWorkSpaceSettings = async ({queryKey}:any) => {
          
          const response = await axiosInstance(`/home/workspace/${queryKey[1]}/settings`)
          const data = response.data;

          return data.settings;
      }
      
      const {isLoading, data, error} = useQuery<SettingsObj|undefined, any>(["getWorkSpaceSettings", workSpaceId], getWorkSpaceSettings);

      if(isLoading){

      }


      if(error){

      }

     const [formValues, setFormValues] = useState();


   return (

     <div>
        
        

        
     </div>
   )
 }
 
 export default WorkSpaceSettings;