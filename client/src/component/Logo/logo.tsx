import {CgNotes} from 'react-icons/cg';
import {Link} from 'react-router-dom';
import React from 'react'

interface LogoProps {
  classes?: string,
  size?: number

}

function Logo({classes, size=33} : LogoProps) {
  return (
    <Link to={'/home'} className="flex items-center">
    <div className={`mr-1`}>
       <CgNotes size={size}/>
    </div>
     <h3 className={`text-xl font-poppins font-semibold ${classes}`}>Flow</h3>
    </Link>
  )
}

export default Logo;