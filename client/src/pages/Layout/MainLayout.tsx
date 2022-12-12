
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from '../../http';
import { RootState } from '../../redux/app/store';
import EmailNotVerified from '../emailVerification/EmailNotVerified';
import HomePage from '../LandingPage/HomePage';
import { useQuery } from 'react-query';
import { UserObj } from '../../types/component.types';
import {useEffect} from 'react';
import { setCurrentUser } from '../../redux/features/authSlice';
import HomePageLayout from './HomePageLayout';



function MainLayout() {

  const dispatch = useDispatch();
  const { user } = useSelector((state : RootState) => state.auth);
   

  const currentUser = async () => {
     const response = await axiosInstance.get('/user/readme');
     const data = response.data;
     return data.user;
  }   

//   const onSuccess = (data:UserObj | null) => {
//       if(data){
//          dispatch(
//             setCurrentUser({
//                 _id: data._id,
//                 username: data.username,
//                 email: data.email,
//                 avatar: data.avatar,
//                 emailVerified: data.emailVerified,
//                 isGoogleAuth: data.isGoogleAuth
//             })
//          )
//       }
//   }

  
  const {data, error} = useQuery<UserObj | null>('currentUser', currentUser);

   useEffect(() => {

      if(data){

         dispatch(setCurrentUser({
            _id: data._id,
                username: data.username,
                email: data.email,
                avatar: data.avatar,
                emailVerified: data.emailVerified,
                isGoogleAuth: data.isGoogleAuth
         }))
      }
   }, [data])

  if(user){
   
   if(user.emailVerified){
      return <HomePageLayout />
   }else{
      return <EmailNotVerified />
   }   
}
  

  return (
   <div className='w-screen h-screen flex justify-center items-center'>
      {error ? "Oops, Something went wrong" : "Loading..."}
   </div>
  )
}

export default MainLayout;