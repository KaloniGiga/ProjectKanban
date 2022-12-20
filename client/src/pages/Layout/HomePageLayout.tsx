import { useSelector, useDispatch } from "react-redux"
import Navbar from "../../component/navbar/navbar"
import Sidebar from "../../component/Sidebar/Sidebar"
import { RootState } from "../../redux/app/store"
import {hideSidebar, showSidebar} from "../../redux/features/sidebarSlice"
import {Outlet} from 'react-router-dom';
import Modal from "../../component/Modal/Modal"

function HomePageLayout() {
   const dispatch = useDispatch();

   const {show} = useSelector((state: RootState) => state.sidebar)
   const modal = useSelector((state: RootState) => state.modal);
   
   const handleClick = () => {
      if(show){
        dispatch(hideSidebar());
      }else{
        dispatch(showSidebar());
      }
   }

  return (

    <div className="w-screen h-screen relative">
      { modal.modalType !== null && <Modal {...modal} /> }
      <div className="flex flex-col">
       <Navbar />

       <section className="flex flex-1 " style={{minHeight: '92vh'}}>
         <Sidebar show={show} onClick={handleClick}/> 

         <main className={`flex-1 bg-secondary`} >
           <Outlet />
         </main>
       </section>
      </div>
    </div>
  )
}

export default HomePageLayout