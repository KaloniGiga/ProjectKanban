

import React from 'react'
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/app/store';
import authSlice from '../../../redux/features/authSlice';
import { MemberObj } from '../../../types/component.types';
import Avatar from '../../Avatar/Avatar';

interface WorkSpaceMemberType {
  myRole: string,
  workSpaceId: string,
  member: MemberObj
}

function WorkSpaceMember({myRole, workSpaceId, member}:WorkSpaceMemberType){

  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();


  const addToWorkSpace = () => {


  }
  
    return (

    <div>
         {/* Avatar and username of a memeber */}
      <div>
        <Avatar src={member.profile} isAdmin={member.role === "ADMIN"} />
        <span>{member.username}</span>
      </div>

      <div>
        {member.role === "GUEST" ? (
          //  member role for guest and add to workspace button for admin
          <div>
            <div>{member.role}</div>

            <div>
             {myRole === "ADMIN" && (
                <button>Add to WorkSpace</button>
             )}

           </div>
          </div>
          
        ):(
          // Member role or role dropdown for admin
          <>
           <div>
              {myRole === "ADMIN" ? (
                // Role Dropdown
                 <div>

                 </div>
              ) : (
                 
                 <div>
                  {member.role}
                </div>
              )}

           </div>
       {/* Leave or Remove button */}
           <div>
              {user?._id === member._id ? (
                 <button>
                   Leave
                 </button>

              ): (

                myRole === "ADMIN" && (

                  <button>Remove</button>
                )
              )}

           </div>
          </>
        )}

      </div>
    </div>
  )
}

export default WorkSpaceMember;