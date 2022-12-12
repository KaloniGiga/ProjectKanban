

import React,{useState} from 'react'
import { NavLink } from 'react-router-dom';
import {IconType} from 'react-icons'

interface SidebarLinkProps {
    show : boolean
    to: string,
    Icon: IconType,
    text: string
}

function SidebarLink({show, to, Icon, text}:SidebarLinkProps) {

    const [currentActive, setCurrentActive] = useState(false);

  return (

     <NavLink to={to}
      className={({isActive}) => {
        
         setCurrentActive(isActive);
         return `bg-surface  flex items-center text-sm 
         ${isActive ? "bg-primary_light hover:primary_dark" : "hover:primary_light" }
         ${!show ? "py-4 px-2" : "px-4 py-2"}`
      }}
      >
      
      <div className='mr-4'><Icon size={23} /></div>
    {show &&  <span  style={{fontSize: "17px"}}>{text}</span>}
     </NavLink>
  )
}

export default SidebarLink;