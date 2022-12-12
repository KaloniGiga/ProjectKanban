
import {useQuery} from 'react-query';
import React from 'react'
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux'
import axiosInstance from '../../../http';
import Loader from '../../Loader/loader';
import WorkSpaceItem from './WorkSpaceItem';
import {WorkSpaceObj} from '../../../types/component.types';
import {showModal} from '../../../redux/features/modalslice';

function WorkSpaceList() {

   const dispatch = useDispatch();

   const queryClient = useQueryClient();

   const getWorkSpaces = async () => {
       const response = await axiosInstance.get('/workspaces');
       const data = response.data;
       return data.workspaces;
   }


   //const {isLoading, data, error} = useQuery<WorkSpaceObj[] | undefined, any >(["getWorkSpaces"], getWorkSpaces)

   // if(isLoading){
      
   //    return (
   //       <div className='h-15 w-full flex items-center justify-center'>
   //          <Loader />
   //       </div>
   //    )
   // }



   // if(error){
     
   //    return (
   //       <div className='w-full h-15 flex items-center justify-center'>

   //          <div className='flex flex-col items-center justify-center'>
   //              <span className='text-sm text-primary'>Oops! Something went wrong.</span>
   //               <button type='button' onClick={() => {
   //                  queryClient.invalidateQueries(["getWorkSpaces"]);
   //               }}>Retry</button>
   //          </div>
   //       </div>
   //    )
   // }

 const data = [{
     _id: "ldieniiiddue",
     name: "social",
     picture: 'profile.jpg',
     isFavourite: false,
     FavouriteId: null,
     role: 'Admin'
 },]

  return (
   <>
    {data && data.length > 0 ? (

        data.map((workspace) => {
            return <WorkSpaceItem key={workspace._id} id={workspace._id} name ={workspace.name} />
        })
            
    ): (

        <div>
           <h3>Create a <button type='button' onClick={() => {
                dispatch(showModal({modalType: "CREATE_SPACE_MODAL"}))
           }}>WorkSpace</button></h3>
        </div>
    )}
    
   </>
  )
}

export default WorkSpaceList;