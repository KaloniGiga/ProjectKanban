import { NavLink } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../../http';
import { FavoriteObj } from '../../../types/component.types'
import Icon from '../../icon/icon';
import { iteratorSymbol } from 'immer/dist/internal';
import Avatar from '../../Avatar/Avatar';
import Options from '../../Options/Options';
import OptionsItem from '../../Options/OptionsItem';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

interface FavoriteSpaceItemType {
    id: string,
    fav: FavoriteObj,
}

function FavoriteSpaceItem({id, fav}:FavoriteSpaceItemType) {
    
     const dispatch = useDispatch();
     const queryClient = useQueryClient();
     const [showIcon , setShowIcon] = useState(false);
     const [showOptions, setShowOptions] = useState(false);
     const [isCurrentWorkSpace, setIsCurrentWorkSpace] = useState(false);

     const OptionsBtnRef = useRef();

     const removeFavorite = (favId: string, workspaceId: string) => {
         
      axiosInstance.delete(`/favorites/${favId}`)
         .then((response) => {
             
            setShowOptions(false);

            if(queryClient.getQueryData(["getWorkSpace", workspaceId])){

               queryClient.setQueryData(["getWorkSpace", workspaceId],
               (old: any) => {
                  return {
                  ...old,
                  isFavorite: false,
                  FavoriteId: null
                  }
               })
            }

            queryClient.setQueryData(["getFavorites"], (old : any) => {
                return old.fliter((item:any) => item._id.toString() !== favId )
            })
         })
     }

     useEffect(() => {
        setShowOptions(showOptions);

        if(showOptions === true){
          setShowIcon(true);
        }
     },[showOptions]);


  return (
    <div className='w-full px-2 py-1 '>
     
          <NavLink to={`home/workspace/${fav.resourceId}/boards`} >
           
           <div className='flex items-center justify-between '>
             <div className='w-full flex items-center'>
              {fav.icon ? (
               <Icon src={fav.icon} alt="Icon" classes='mr-1' size={20}/>
              ):(
               <Avatar  alt={fav.name} classes="rounded-full mr-1" size={25} />
              )}

              <div className='ml-3'>
                { fav.name.length > 9 ? (

                 <span>{ fav.name.slice(0, 9) + '...' }</span>

                 ):(<span>{fav.name}</span>)
              }
               </div>
             </div>

             <div>
               <button>
                <HiOutlineDotsHorizontal />
               </button>
             </div>
           </div>

          </NavLink>
    </div>
  )
}

export default FavoriteSpaceItem;