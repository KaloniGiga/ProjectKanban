import Avatar from "../Avatar/Avatar";
import {BsFillBellFill, BsSearch} from 'react-icons/bs';
import Logo from "../Logo/logo";
import Frame from 'Fram 4.png';
import {HiOutlineChevronDoubleDown} from 'react-icons/hi';
import {AiOutlinePlus} from 'react-icons/ai';
import {BsBell} from 'react-icons/bs'
import Search from "../Search/Search";
import { useDispatch } from "react-redux";
import { logOutUser } from "../../redux/features/authSlice";

function Navbar() {

  const dispatch = useDispatch();

  
  const logout = () => {
    dispatch(logOutUser());
 }


  return (

     <div className="py-3 bg-surface flex justify-end items-center mr-10">  
      <div className="flex-end">
        <button className="bg-primary px-1 py-2 rounded text-white" onClick={logout}>Logout</button>
      </div>
     </div>


  )

}

export default Navbar;