
import React from 'react'
import { IconType } from 'react-icons'
import ReactTooltip from 'react-tooltip'

interface CustomBtnProps {
   label: string,
   Icon: IconType,
   Id: string,
   classes?: string,
   onClick?: Function,
   iconSize ?: number,
   iconColor ?: string,
   color ?: string,
   isSubmitting?: boolean,
  iconClasses: string,
}


function CustomBtn({label, Icon, Id, classes, onClick, iconColor, iconSize, color, isSubmitting, iconClasses}:CustomBtnProps) {

  return (
    <>
    <button
    type="button"
    data-tip
    data-for={Id}
    aria-label={label}
    onClick = {(e) => onClick && onClick(e)}
    className={`disabled:opacity-20 
      ${classes}`}
    disabled={isSubmitting ? true : false}
    >

        <Icon
        color={iconColor ? iconColor: "secondary"}
        className={iconClasses}
        size={iconSize} />

    </button>
    {label && (
        <ReactTooltip>
            <span className='capitalize'>{label}</span>
        </ReactTooltip>
    )}
   </>
  )
}

export default CustomBtn