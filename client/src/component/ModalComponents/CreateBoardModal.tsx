
import React, {useState} from 'react'
import { AxiosError } from 'axios'
import Input from '../Input/Input'
import SelectBackground from '../CustomSelectButton/SelectBackground'
import SelectWorkSpace from '../CustomSelectButton/SelectWorkSpace'
import SelectBoardVisibility from '../CustomSelectButton/SelectBoardVisibility'
import Button from '../button/Button'
import axiosInstance from '../../http'
import { CgSpaceBetween } from 'react-icons/cg'
import { SelectOption, WorkSpaceObj } from '../../types/component.types'
import { QueryClient, useQuery, useQueryClient } from 'react-query'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { hideModal } from '../../redux/features/modalslice'

interface Props {
  workspaceId ?: string
}

function CreateBoardModal({workspaceId}: Props) {

  const [values, setValues] = useState({
        title: '',
        background: '',
        workSpaceId: '',
        boardVisibility: ''

  })

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  //handleChange in input values
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
     
     setValues({...values, [e.target.name]: e.target.value});
  }

  //handleChange in select Elements
  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
     setValues({...values, [e.target.name]: e.target.value})
     console.log(e.target.name, e.target.value)
     console.log(values)
  }

  //handleChange in boardBackground
  const handleChangeBackground = (choosenValue:any) => {
    setValues({...values, background: choosenValue})
    console.log(values.background)
  }

    //handles the form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    setIsSubmitting(true);

    const board = {
       title: values.title,
       background: values.background,
       workspaceId: values.workSpaceId,
       boardVisibility: values.boardVisibility
    }

    axiosInstance.post('/boards', board)
    .then((response) => {

       const data = response.data;
       
       queryClient.invalidateQueries(["getWorkSpaceBoards", data.workspaceId]);

       //update Workspacedata
       
        setIsSubmitting(false);
        dispatch(hideModal());

        //navigate to the new board
    })
    .catch((error: AxiosError) => {
         
        setIsSubmitting(false)

        if(error.response){
           const message = error.response.data;
           


        }else if(error.request){
          
        }else{

        }
    })

  }


  const visibilityOptions = [
    {
      value: "Public",
      name: "Public - All members of this workspace can see and edit this board"
    },
    {
      value: 'Private',
      name: "Private - Only board members and workspace admins can see and edit this board",
    }
  ]


  const getMyWorkSpaces = async () => {
      
     const response = await axiosInstance.get('/workspace/me');
      
     const data = response.data;

     return data.map((workspace: WorkSpaceObj) => ({
         id: workspace._id,
         name:  workspace.name,
     }))
  }


  const  {data, isLoading, isFetching, error } = useQuery<SelectOption[] | undefined, any, SelectOption[], string[]>(['getMyWorkSpaces'], getMyWorkSpaces, {cacheTime: 0, staleTime: 0})

  return (

    <div className='px-2'>
        <h1 className='font-semibold text-xl mb-2'>Create a Board</h1>

       <form onSubmit={handleSubmit}>
        {/* Enter Board Title */}
         <Input label="Board Title" typeName='text' placeholder='Enter Board Title' name='title' value={values.title} onChange={handleChangeInput}/>
         
         {/* Choose Background color */}
         <SelectBackground label='Choose_Background' changeBackgound={handleChangeBackground} />

         
         {/*Select Workspace  */}
         <SelectWorkSpace label='Choose WorkSpace' options={data} value={values.workSpaceId} defaultWorkSpace={workspaceId} isFetching={false} isLoading={isLoading} workspaceId={workspaceId} changeWorkSpace={handleChangeSelect}/>

         {/* Select Board visibility */}
         <SelectBoardVisibility label='Choose Board Visibility' options={visibilityOptions} defaultVisibility="PUBLIC" value={values.boardVisibility} changeVisibility={handleChangeSelect} />

         <div className='flex justify-center'>
           <Button name='Create Board' classes='w-full mx-4'/>
         </div>

       </form>
    </div>
  )
}

export default CreateBoardModal