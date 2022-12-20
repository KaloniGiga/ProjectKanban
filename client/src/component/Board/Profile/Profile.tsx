
import React from 'react'
import Avatar from '../../Avatar/Avatar';
import BoardMember from '../BoardMembers/BoardMember';


interface Props {
    name: string,
    classes?: string,
    isAdmin?: boolean;
    src?: string,
    alt?:  string,
    styles?: Object,
    onClick?: () => void,
    defaultImg: string
}


function Profile({name, src, alt, isAdmin, classes, onClick, styles, defaultImg}: Props) {

  return (

    <div className='relative'>
          {src ? (
            <img
             className={`w-8 h-8 rounded-full ${classes ? classes : ""} `}
             onClick={onClick}
             src={src ? src : defaultImg}
             alt={alt}
             style={styles ? styles : {}}
            />
          ):(

            <div>
                <Avatar />
            </div>
          )}

            {isAdmin && (
             <img 
             src='AdminIcon'
             alt='adminIcon'
             className='absolute top-5 right-5 rounded'/>
           )}

         
    </div>
  )
}

export default Profile