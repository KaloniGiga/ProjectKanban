import { useDispatch, useSelector } from 'react-redux';
import React, { useRef } from 'react'
import { RootState } from '../../redux/app/store';
import {HiChevronDown, HiOutlinePlus, HiChevronRight} from 'react-icons/hi'
import { setCurrentActiveMenu } from '../../redux/features/sidebarMenuSlice';
import { showModal } from '../../redux/features/modalslice';

interface MenuTypes {
  id: number | null,
  name: string,
  component: JSX.Element ,
  button: boolean,
}


function SidebarMenu({id, name, component, button}:MenuTypes) {

  const dispatch = useDispatch();
  const {currentActiveMenu} = useSelector((state: RootState) => state.sidebarMenu);
  const ref = useRef<any>(null);

  const handleHeaderClick = (e : any) => {
      
     if(ref.current){
        if(!ref.current.contains(e.target)){
            dispatch(setCurrentActiveMenu(currentActiveMenu === id ? null : id))
        }
     }else{
         dispatch(setCurrentActiveMenu(currentActiveMenu === id ? null : id ))
     }
  }


  const handleChevronClick = () => {

      dispatch(showModal({modalType: "CREATE_WORKSPACE_MODAL"}));
  }
    
  return (
    
    <li className={`${currentActiveMenu === id ? "text-gray border-b" : "text-black-400 border-b"}`}>
       <header className='flex justify-between items-center w-full px-3 py-2' onClick={handleHeaderClick}>

        <div className='flex items-center'>

         <div className='mr-2'>
          {currentActiveMenu === id ?(
            <HiChevronDown />
          ): (
            <HiChevronRight />
          )   
          }

         </div>

         <h3 className='uppercase'>{name}</h3>
         </div>
          
          {button && (
             <button ref={ref} onClick={handleChevronClick}>  
                <HiOutlinePlus />
             </button>
          )}
          
       </header>

       <div className={`${currentActiveMenu === id ? 'block' : 'hidden'}`}>
         {component}
         
       </div>
    </li>
  )
}

export default SidebarMenu;