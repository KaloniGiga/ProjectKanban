
import {BoardObj} from '../../types/component.types'
import { useDispatch } from 'react-redux';
import { useQueryClient } from 'react-query';
import { NavLink } from 'react-router-dom';
import {useState} from 'react';
import { CgOverflow } from 'react-icons/cg';
import { HiOutlineStar } from 'react-icons/hi';

interface BoardPropsType{
   board: BoardObj,
   workSpaceId: string
}


function Board({board, workSpaceId}:BoardPropsType) {

    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [isHovered, setIsHovered] = useState<boolean>(false);


    const addToFavorite = (boardId:string) => {

    }


    const removeFavorite = (favId:string|null, boardId:string) => {

    }

  return (
    
     <NavLink to={`/home/board/${board._id}`}>

      <div 
       onMouseEnter={() => setIsHovered(true)}
       onMouseLeave={() => setIsHovered(false)}

      className='relative h-25 text-white drop-shadow-xl font-semibold rounded cursor-pointer hover:bg-surface-900'
      style={{
        background: board.bgImage ? `url(${board.bgImage})` : board.color,
        backgroundSize: "cover",
        backgroundOrigin: "border-box",
        backgroundRepeat: "no-repeat",
        width: "220",
        maxHeight: "250",
        backgroundPosition: "50%",
        backgroundBlendMode: "overlay", 

      }} >

        
        <div className='absolute top-0 bottom-0 left-0 right-0 px-3 py-2'>
          {board.name}
        </div>

        {isHovered && (
            <div className='absolute bottom-1 right-1'>
              {board.isFavourite ? (
                 <button onClick={(e) => {
                    e.preventDefault();
                    removeFavorite(board.FavouriteId, board._id);
                 }}>

                  <HiOutlineStar fill='#fbbf20' />

                 </button>
              ):(
                <button onClick={(e) => {
                  e.preventDefault();
                  addToFavorite(board._id);
                }}>
                  <HiOutlineStar />
                </button>
              )
              }

            </div>
        )}

      </div>

     </NavLink>
  )
}

export default Board;