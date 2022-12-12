import React from 'react'
import LogoIcon from '../../assets/LogoIcon.png'

interface AvatarProps {
    src?: string,
    alt?: string,
    size?: number,
    styles?: Object,
    classes?: string,
    isAdmin?: boolean,
    onClick?: () => void
}

function Avatar({src, alt, styles, classes, size, isAdmin, onClick}:AvatarProps) {

  return (
    <>
        {src ? (
           <img
           referrerPolicy='no-referrer'
           src={src}
           alt={alt}
           className={`rounded-full ${classes ? classes : ""}`}
           style={styles ? styles : {}}
           width={size}
           height = {size}
           onClick={onClick}
            />)
            :
            (<img
            src={LogoIcon}
            alt={"Logo"}
            className={`rounded-full ${classes ? classes : ""}`}
            onClick={onClick}
            style={styles ? styles: {}}
            width={size}
            height={size}
            />)
        }
    </>
  )
}

export default Avatar;