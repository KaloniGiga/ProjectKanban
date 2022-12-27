import React from 'react';
import { useQueryClient, useQuery } from 'react-query';
import axiosInstance from '../../../http';
import {FavoriteObj} from '../../../types/component.types'
import Loader from '../../Loader/loader';
import FavoriteBoardItem from './FavoriteBoardItem';
import FavoriteSpaceItem from './FavoriteSpaceItem';

function FavoriteList() {

    const queryClient = useQueryClient();

    const getFavorites = async () => {
       const response = await axiosInstance.get('/favorites');
       const data = response.data;

       return data.favorites;
    }


    const {isLoading, data, error } = useQuery<FavoriteObj[] | undefined, any, FavoriteObj[], string[]>(['getFavorites'], getFavorites);

  if(isLoading) {

       return (
       <div className='w-full flex justify-center items-center' style={{height: '7rem'}}>
        <Loader />
       </div>
       )
    }


    if(error) {
      return (
      <div className='w-full flex justify-center items-center' style={{height: '7rem'}}>
          
          <div className='flex flex-col justify-center items-center'>
            <span className='text-primary'>Oops! Something went wrong.</span>
            <button type="button" className='text-primary border-1' onClick={ () => {
              queryClient.invalidateQueries(["getFavorites"]);
             }
            }>Retry</button>
          </div>
      </div>
      )

    }

  return (
     <>
       { data && data.length > 0 ? (

         data.map((fav) => {
             return  fav.type === "SPACE" ? (
                <FavoriteSpaceItem key={fav._id} id={fav._id} fav={fav} />
              ):(
                <FavoriteBoardItem key={fav._id} id={fav._id} fav={fav} />
              )
            
         })
       ):(
           
          <div className='px-2 py-1 text-center mt-2 text-sm'>
            <p className='p-1'>No Favorites</p>
          </div>
       )}

     </>
  );
};

export default FavoriteList;