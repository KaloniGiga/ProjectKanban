import { NavLink } from "react-router-dom";
import { BoardObj } from "../../types/component.types";


interface Props {
    board: BoardObj
}

export const RecentBoard = ({board}: Props) => {
    
    return ( 

        <NavLink to={`/board/${board._id}`}>
            <div className="">
               <h3 className="ml-2 font-semibold">{board.name}</h3>
                
            </div>
        </NavLink>
    )
    

}