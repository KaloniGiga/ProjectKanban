

import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { RootState } from '../../../redux/app/store'
import { MemberObj } from '../../../types/component.types'
import Profile from '../Profile/Profile'
import RoleDropDown from './RoleDropDown'

interface Props {
    boardId: string|undefined,
    workspaceId: string,
    myRole: string,
    boardAdmins: MemberObj[],
    member: MemberObj
}


function BoardMember({member, boardId, workspaceId, myRole, boardAdmins}: Props) {
   
     const dispatch = useDispatch();
    const {user} = useSelector((state: RootState) => state.auth);

    const [showDropdown, setShowDropdown] = useState(false);
    
    const isBoardAdmin = boardAdmins.find((boardAdmin) => boardAdmin._id === member._id) ? true : false;

    const isHeOnlyBoardAdmin = isBoardAdmin && boardAdmins.length === 1;



  return (
<>
    <div className='flex justify-between'>
        <Profile name={member.username}
        src={member.profile}
        defaultImg="hero.png" />

        <span className='font-semibold'>{member.username}</span>

        {member._id === user?._id ? (
                <button>Leave</button>
         ): (
            myRole === "ADMIN" && (
                <button>Remove</button>
            )
         )}   

       { myRole === "ADMIN" && (
         <RoleDropDown />
       )}

       
    </div>

  
    </>
  )
}

export default BoardMember