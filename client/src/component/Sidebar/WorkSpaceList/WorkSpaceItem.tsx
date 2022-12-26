import { WorkSpaceObj } from '../../../types/component.types'
import { useDispatch, useSelector } from 'react-redux'
import { HiChevronDown, HiChevronRight, HiOutlinePlus } from 'react-icons/hi'
import { RootState } from '../../../redux/app/store';
import {BsClipboardMinus} from 'react-icons/bs'
import { CgProfile } from 'react-icons/cg';
import {FiSettings} from 'react-icons/fi';
import {useState} from 'react';
import { showModal } from '../../../redux/features/modalslice';
import {setCurrentActiveWorkSpace} from '../../../redux/features/WorkSpaceMenu';
import {NavLink} from 'react-router-dom';


interface WorkSpaceItemProp {
  id: string,
  name: string,
}

function WorkSpaceItem({id, name}:WorkSpaceItemProp) {

        const dispatch = useDispatch();
        const [showContent , setShowContent] = useState(false);

        const {currentActiveWorkSpace} = useSelector((state: RootState) => state.WorkSpaceMenu );

  return (
    <div className='flex flex-col justify-center w-full pl-5 pr-2 bg-surface'>
        
        <header className='w-full  py-1' onClick={() => {
             dispatch(setCurrentActiveWorkSpace(currentActiveWorkSpace===id ? null : id));
        }}>

            <div className='flex items-center'>

              <div className='mr-1'>
              {currentActiveWorkSpace === id ?  (
                 <HiChevronDown size={20}/>
              ): (
                 <HiChevronRight size={20}/>
              )}
              </div>

              <span className='text-md'>{name}</span>
            </div>
        </header>

        <div className={`${currentActiveWorkSpace === id ? "block" : "hidden"}`}>
            <NavLink to={`/home/workspace/${id}/boards`} className={`flex items-center px-2 py-2 hover:bg-primary_light`}>
              <BsClipboardMinus />
              <span className='ml-2'>Boards</span>
            </NavLink>

            <div className='flex items-center   px-2 py-2'>
              <NavLink to={`/home/workspace/${id}/members`} className={` w-full flex items-center hover:bg-primary_light`}>
              <CgProfile />
              <span className='ml-2'>Members</span>
              </NavLink>
              <button className='hover:bg-primary_dark p-1 rounded' onClick={() => {dispatch(showModal({modalType: "INVITE_NEW_MEMBER"}))}}><HiOutlinePlus /></button>
               
            </div>

            <NavLink to={`/home/workspace/${id}/setting`} className={`flex items-center px-2 py-2 hover:bg-primary_light`}>
               <FiSettings />
              <span className='ml-2'>Setting</span>
            </NavLink>
        </div>
    </div>
  )
}

export default WorkSpaceItem;