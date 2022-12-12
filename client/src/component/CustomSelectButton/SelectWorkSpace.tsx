
import React, {useEffect, useState} from 'react'
import { useQueryClient } from 'react-query'
import { SelectOption } from '../../types/component.types';
import CustomBtn from '../button/CustomBtn';
import {HiOutlineRefresh} from 'react-icons/hi';


interface SelectWorkSpaceProps {
    label: string,
    options: SelectOption[] | undefined,
    isFetching:boolean,
    isLoading: boolean,
    defaultWorkSpace: string | undefined,
    changeWorkSpace: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    value: string,
    workspaceId: string | undefined,
}


function SelectWorkSpace({label, workspaceId, value, options, isFetching, isLoading, defaultWorkSpace, changeWorkSpace}:SelectWorkSpaceProps) {

    const queryClient = useQueryClient();

    useEffect(() => {
       if(options && options.length > 0 && !value){
          const isAvailable = defaultWorkSpace ? (options.find((option) => option.id === defaultWorkSpace)) : undefined;

          if(isAvailable) {
             
          }else{
            
          }
       }
    },[options])

  return (

    <div className='flex flex-col mb-2'>
       
       <label htmlFor="selectWorkSpace" className='font-semibold '>{label}</label>

       <div className='flex justify-between items-center'> 

        <select name="workSpaceId" id="workSpaceId"
         className="w-1/2 mr-2 border-2 focus:border-primary p-2 my-2"
         disabled={options && options.length === 0} onChange={changeWorkSpace}>
             
             
            {options && options.map((option) => (
                 <option key={option.id} value={option.id} className="p-2 hover:bg-surface">{option.name}</option>
            ))}
        </select>
       
      
       <CustomBtn
        label='Retry'
        Id='selectWorkSpace'
        Icon={HiOutlineRefresh}
        iconClasses={isFetching ? "animate-spin" : ""}
        iconColor={'primary_light'}
        iconSize={24}
        onClick={() => {
            queryClient.invalidateQueries(["getMyWorkSpaces"])
        }}
        classes="bg-secondary hover:bg-black text-white rounded px-5 py-1 flex items-center justify-center"
         />
       
      </div>
    </div>
  )
}

export default SelectWorkSpace