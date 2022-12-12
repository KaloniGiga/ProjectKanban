


import React, {useEffect, useState} from 'react'
import { HiOutlineRefresh } from 'react-icons/hi';
import { useQueryClient, useQuery } from 'react-query';
import { stableValueHash } from 'react-query/types/core/utils';
import axiosInstance from '../../http';
import CustomBtn from '../button/CustomBtn';
import Loader from '../Loader/loader';

interface Props {
    label: string,
    changeBackgound: Function,
   
}

function SelectBackground({label, changeBackgound}:Props) {

   const queryClient = useQueryClient();

   //const [colors, setColors] = useState(["red", 'black', "green"]);
   const [colors,setColors] = useState(['#dcb4cc', '#ffffdd', '#a2e2ff', '#df685f', '#aadb3a', '#904893']);
   const [currChoosen, setCurrChoosen] = useState(colors[0]);
   const UNSPLASH_URL = import.meta.env.VITE_UNSPLASH_URL;

   const getBackgroundImages = async() => {

     const response = await axiosInstance.get(`${UNSPLASH_URL}/photos/random?orientation=landscape&count=30`, {
        headers: {
            Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_CLIENT}`
        },
     });

      const data = response.data;
      return data
   };


//    const {data, isLoading, isFetching, error} = useQuery(
//      ["getBackgroundImages"], getBackgroundImages, {staleTime: Infinity}
//    );

const data = [{urls: {regular: "text.jpg"}}, {urls: {regular: "image.png"}}]
const isFetching = false;
const error = '';
   
   useEffect(() => {
      
       if(data && !colors.includes(currChoosen)){
          setCurrChoosen(data[0].urls.regular);
       }else{
          setCurrChoosen(currChoosen);
       }
      
   }, [data])

   useEffect(() => {
      changeBackgound(currChoosen)
   }, [currChoosen]);


  return (

    <div className={`flex flex-col w-full`}>
       <div className='flex justify-between items-center'>
        <label htmlFor="background" className='font-semibold'>{label}</label>
         
        {!isFetching && !error && (
           <CustomBtn
           label='New Images'
           Icon={HiOutlineRefresh}
           iconClasses={isFetching ? "animate-spin" : ""}
           iconSize={24}
           iconColor="primary_light"
           Id="backgroundImages"
           classes='mb-2 bg-secondary hover:secondary_light text-white rounded p-1 w-1/6 flex items-center justify-center'
           onClick={() => {
              queryClient.invalidateQueries(["getBackgroundImages"]);
           }} />
        )}
      </div>

        <div id='background'>
         
           <div className='mb-4 h-20'>
              {(isFetching || error) ? (
                 
                 isFetching ? (
                    <div className='w-full h-full flex items-center justify-center'>
                        <Loader />
                    </div>
                 ): (

                    <div className='w-full h-full flex items-center justify-center'>
                      <CustomBtn 
                      label='Retry'
                      Id='Retry' 
                      iconSize={24}
                      classes='mb-2 bg-secondary p-1 text-white rounded w-1/6 flex items-center justify-center hover:bg-black'
                      Icon={HiOutlineRefresh}
                      iconClasses={isFetching ? "animate-spin" : ""} 
                      onClick={() => {
                        queryClient.invalidateQueries(["getBackgroundImages"]);
                      }}
                      />
                    </div>
                 )
              ): (
                <div className='flex items-center pb-1'>
                 { data && data.map((image: any) => {
                     return (
                        <button
                         type='button'
                         key={image.id}
                         aria-label="background images"
                         onClick={() => {
                            setCurrChoosen(image.urls.regular);
                            
                         }}
                         className={`mr-1 h-10  ${currChoosen === image.urls.regular 
                          ? "border-2 border-primary_light-500" : ""}`}
                         >
                           {/* <img
                            style={{
                              minWidth: '20px'
                            }}
                            src={image.urls.thumb}
                            alt={image.description}
                           /> */}
                        </button>
                     )
                 })}
                </div>
              )}

           </div>

           <div className='flex items-center pb-2 w-full'>

             { colors.map((color:string) => {
               return(
                  <button
                   type='button'
                   aria-label='background-color-select'
                   onClick={() => setCurrChoosen(color)}
                   key={color}
                   className={`h-10 rounded mr-1 ${currChoosen === color ? "border-2 border-primary": ""}`}
                   style={{
                     background: color,
                     minWidth: '60px'
                   }}
                  >
                  </button>
               )
               })
             }
           
           </div>
        
    
         </div>
    </div>
  )
}

export default SelectBackground;