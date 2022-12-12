
import React from 'react'

interface IconProps {
    src: string,
    alt: string,
    size?: number,
    classes?: string
}
function Icon({src, alt, size, classes}:IconProps) {
  return (
    <div>
       <img src={src}
        alt={alt}
        className={classes}
        width={size}
        height={size}
       />

     </div>
  )
}

export default Icon;