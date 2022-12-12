

import React from 'react'
import { CgClose } from 'react-icons/cg'
import { UserObj } from '../../types/component.types'

interface Props {
    member: UserObj
}

const handleClick = () => {
    
}

function SelectedMembers({member}:Props) {
  return (
    <div className='flex bg-gray rounded-xl items-center p-1'>
        <span className='mr-1 text-white'>{member?.username}</span>
        <div className='' onClick={handleClick}><CgClose color='white'/></div>
    </div>
  )
}

export default SelectedMembers