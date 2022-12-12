import { ButtonProps } from "../../types/component.types"

function  Button({isSubmitting, name, color, hoverColor, classes, onClick}:ButtonProps) {
  
   return (
    <button type="submit" className={`bg-secondary rounded px-3 py-2 my-2 text-lg text-white hover:bg-black ${classes}`} onClick={onClick}>{isSubmitting ? 'isSubmitting' : name }</button>
  )
}

export default Button;