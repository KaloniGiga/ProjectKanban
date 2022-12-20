
import React from 'react'
import Logo from '../Logo/logo';
import {HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight} from 'react-icons/hi'
import SidebarLink from './SidebarLink';
import {VscHome} from 'react-icons/vsc';
import {IoSettingsOutline} from 'react-icons/io5'
import SidebarMenu from './SidebarMenu';
import WorkSpaceList from './WorkSpaceList/WorkSpaceList';
import FavoriteList from './FavouriteList/FavoriteList';

interface SidebarProps {
   show: boolean,
   onClick: () => void
}

function Sidebar({show, onClick}:SidebarProps) {

  return (
    <div className={` ${show ? 'w-1/4' : 'w-12 '}`}>

      <div className={`${show ? "flex justify-between items-center px-3 py-2" : "ml-2"}`}>
       {show && <Logo size={20} /> }

       <button onClick={onClick} className="flex-end p-2 rounded bg-surface">
        {show ? <HiOutlineChevronDoubleLeft /> : <HiOutlineChevronDoubleRight />}
        
       </button>
      </div>

      <main>

         <div className=' flex flex-col border-b'>
           <SidebarLink show={show} to='/home' Icon={VscHome} text='Home'/>
           <SidebarLink show={show} to='/profile' Icon={IoSettingsOutline} text='Setting'/>
         </div>

        {show && <ul>
           <SidebarMenu id={0} name='Favorites' component={<FavoriteList />} button={false}/>
              
           <SidebarMenu id={1} name='WorkSpaces' component={<WorkSpaceList />} button={true}/>
         </ul>}


               
      </main>
        
      </div>
  )
}

export default Sidebar;