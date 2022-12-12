
import React, { useCallback, useState } from 'react'
import Button from '../button/Button';
import Input from '../Input/Input';
import AsyncSelect from 'react-select/async'
import debounce from 'debounce-promise';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import axiosInstance from '../../http';
import { hideModal } from '../../redux/features/modalslice';
import { AxiosError } from 'axios';

interface UserObj {
  _id: string,
  username: string,
  avatar: string
}


interface WorkSpaceObj {
  name: string,
  description: string,
  members: UserObj[]
}


function CreateWorkSpaceModal() {

  const [values, setValues] = useState<WorkSpaceObj>({
      name: '',
      description: '',
      members: [],
  })

  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleChange = () => {

  }

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {

      const workspaceValues = {
         name: values.name,
         description: values.description,
         members: values.members.map((m) => m._id)
      }

      setIsSubmitting(true);

      axiosInstance.post('/workspace', workspaceValues)
      .then((res) => {
          const data = res.data;
          //update workspace list
          queryClient.setQueryData([`getWorkSpaces`], (oldData: any) => {
              return [...oldData, data];
          });

          setIsSubmitting(false)
          //navigate to newly created workspace
          
          dispatch(hideModal());
      })
      .catch((error: AxiosError) => {
         
        setIsSubmitting(false);

        if(error.response) {
           const response = error.response;
           const message  = response.data;
           
           //add error toast

        }else if(error.request){

          //add error toast
        }else {

          //add error toast


        }

      })

  }, [])

  const searchUsers = async (value: string) => {

       if(value){
        const response = await axiosInstance.get(`/users/search?q=${value}`)

        const data = response.data;
        return data;
       }
  }


  const delayFetch = useCallback(debounce(searchUsers, 300), []);

  const fetchUsers = (value: string) => {
     return delayFetch(value)
  }


  return (
    <>
    {isFirstSlide ? (
    <div className='flex flex-col w-full items-center justify-center'>
       <h1 className='font-semibold text-xl'>Create your WorkSpace</h1>

      <form onSubmit={handleSubmit} className="w-1/2">
        <Input typeName='text' placeholder='WorkSpace Name' name='WorkSpace' label='WorkSpace' value='' onChange={handleChange}/>
        
        <label htmlFor="description" className='font-semibold'>Description</label><br />
        <textarea rows={3}  className='border-2 w-full border-black mt-3 p-2 mb-2' placeholder='Write description here...'></textarea><br />

       <Button name='Continue' hoverColor='black' classes='w-full' onClick={() => setIsFirstSlide(false)}/>
      </form>
      
    </div>

  ):(
    <div >

       <label htmlFor="async-select" className='ml-5 font-semibold inline-block mb-6'>Invite Members (Optional)</label>

       <AsyncSelect
        className='text-sm w-2/3 mx-auto block'
        isMulti={true}
        autoFocus={true}
        loadOptions={fetchUsers}
        id="async-select"
        name='async-select'
        />

        <Button name="Invite Members" classes='w-1/2 mx-auto block'/>

        <Button name='Go Back' classes='w-1/2  block mx-auto bg-black hover:bg-secondary' onClick={() => setIsFirstSlide(true)}/>
    </div>
  )}
</>
  )
}

export default CreateWorkSpaceModal