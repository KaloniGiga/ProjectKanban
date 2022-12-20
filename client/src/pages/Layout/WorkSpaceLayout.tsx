import { useQuery } from 'react-query';
import { Outlet, useParams } from 'react-router-dom';
import axiosInstance from '../../http';
import Icon from '../../component/icon/icon';
import Avatar from '../../component/Avatar/Avatar';
import { CgSpaceBetween } from 'react-icons/cg';
import {AiOutlineEdit} from 'react-icons/ai';
import { WorkSpace } from '../../types/component.types';


function WorkSpaceLayout() {

const {id:workSpaceId} = useParams();

if(!workSpaceId){
  return <div></div>
}

const getWorkSpaceDetails = async ({queryKey}:any) => {
   const response = await axiosInstance(`/worspace/${queryKey[1]}`);
   const data = response.data;
   return data.workspace;
}

//const {isLoading, data, error} = useQuery<WorkSpace, any>(['getWorkSpaceDetails', workSpaceId], getWorkSpaceDetails)

const data = {
    _id: 'ldieeiidjd',
    name: "socail",
    description: "",
    picture: null,
    myRole: "ADMIN"
  }

const myRole = data?.myRole;


  return (

    <div className='flex flex-col h-full'>

      {data && (

         <>
          <div className='flex w-full items-center'>

            <div className='mr-3'>
              {data.picture ?
               <Icon src={data.picture} alt={data.name} size={50} />
              :
              <Avatar size={50} />
            }
            </div>

            <div className='flex space-between items-center'>

              <div className='flex flex-col'>
                <h2>{data.name}</h2>
                <p>{data.description}</p>
              </div>
               
               <div>
                <AiOutlineEdit />
               </div>

            </div>
          </div>

      

      <div className='w-full'>
       
        <Outlet context={{workSpaceId, myRole}} />
      </div>

      </>
      )}
    </div>
  )
}

export default WorkSpaceLayout;