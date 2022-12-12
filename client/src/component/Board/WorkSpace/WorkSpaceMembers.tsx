

import React from 'react'
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux'
import axiosInstance from '../../../http';
import { MemberObj, WorkSpaceContext } from '../../../types/component.types';
import Loader from '../../Loader/loader';
import {showModal} from '../../../redux/features/modalslice';
import WorkSpaceMember from './WorkSpaceMember';
import { useOutletContext } from 'react-router-dom';


function WorkSpaceMembers() {

       const dispatch = useDispatch();
       const {workSpaceId, myRole} = useOutletContext<WorkSpaceContext>();
       console.log(workSpaceId, myRole);

       if(myRole !== "ADMIN" && myRole !== "NORMAL"){
           return <div className='w-full h-full flex justify-center items-center'>
             <h1 className='w-full text-center'>You don't have permission to see.</h1>
           </div>
       }

       const getWorkSpaceMembers = async ({queryKey}:any) => {

          const response = await axiosInstance.get(`/workspace/${queryKey[1]}/members`)
           const data = response.data;

           return data.members;
        };


      const {isLoading, data, error} = useQuery<MemberObj[]|undefined, any>(["getWorkSpaceMembers", workSpaceId], getWorkSpaceMembers);

      if(isLoading){
         <div className='w-full h-full flex justify-center items-center'> 
              <Loader />
         </div>
      }


      if(error){
        <div className='w-full h-full flex justify-center items-center'>
              <p>Something went wront!</p>
        </div>
      }

  return (

    <div className='mt-2 px-4 py-3'>
        {data && data.length > 0 ? (

           <div>

            <div className='mb-4'>
              <h3 className='font-semibold text-xl'>Members and Guest</h3>
               <p>A List of all Members and Guests of WorkSpace</p>
            </div>

            {myRole === "ADMIN" && (
                <div className='flex justify-center items-center'>

                   <button
                   className='bg-secondary text-sm'
                   onClick={() => {

                     dispatch(showModal({
                        modalType: "INVITE_WORKSPACE_MEMBERS",
                        modalProps: {
                          workSpaceId: workSpaceId,
                        }
                     }))
                   }}

                   >Invite WorkSpace Members</button>

                </div>

            )}

             <div className='border bg-white'>
                {
                  data.map((member) => {
                    return <WorkSpaceMember member={member} myRole={myRole} workSpaceId={workSpaceId} />
                  })
                }

             </div>
           </div>

        ):( 
           <p>No Members</p>
        )}
    </div>
  )
}

export default WorkSpaceMembers