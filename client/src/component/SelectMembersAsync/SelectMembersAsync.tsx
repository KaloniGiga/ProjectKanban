

import React, { useEffect, useState } from 'react'
import { CgChevronDoubleDown, CgChevronDoubleRight } from 'react-icons/cg';
import { UserObj } from '../../types/component.types';
import SelectedMembers from './SelectedMembers';


interface Props{
   

}

function SelectMembersAsync( ) {

      const [members, setMembers] = useState<UserObj[]>([
        {_id: 'siekiiid', username:'dipak', email: "simonkaloni12@gmail.com", avatar: "simon.jpg", isGoogleAuth: false, emailVerified: true}
      ]);

      const [isEmpty, setisEmpty] = useState(true);

      const [value, setValue] = useState<string | null>(null);

      const Options: any[] = ['dipak', 'kalauni'];


      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              e.preventDefault();
              setValue(e.target.value);
      }
       
      const searchUser = () => {


      }

      const loadUser = (value:string) => {

      }


     value && useEffect(() => {
          loadUser(value);
      })


  return (

    <div>
      <label>Invite Members</label> <br />
      
      <div className='flex items-center'>
        <div>
           {members && members.map((member:UserObj) =>  <SelectedMembers member={member} />)}
        </div>

        <div>
            <input className='w-full p-1 m-1 border-2 border-primary' onChange={handleChange}/> 
        </div>

        <div className='p-1 border-2 border-black'>
         {isEmpty ? 
           <CgChevronDoubleRight size={25} />
           :
           <CgChevronDoubleDown size={25} />
        }
         
        </div>

      </div>
    </div>
  )
}

export default SelectMembersAsync;