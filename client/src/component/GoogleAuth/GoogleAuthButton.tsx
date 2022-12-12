import {useEffect, useState} from 'react'
import axiosInstance from '../../http';
import {useDispatch} from 'react-redux';
import { loginUser } from '../../redux/features/authSlice';

interface GoogleAuthProps {
   setError : (error:string) => void
}


function GoogleAuthButton(props:GoogleAuthProps) {
     
     const dispatch = useDispatch();
    

    const handleCallbackResponse = async (response: any) => {
        console.log("jwt token: " + response.credential);

       const credential = {
           'tokenId' : response.credential,
       }

       axiosInstance.post('/google', credential)
        .then((response) => {
          console.log(response.data);
           const data = response.data;
            
           const accessToken = data.token.accessToken;
           const refreshToken = data.token.refreshToken;
          
           dispatch(
            loginUser({
              accessToken,
              refreshToken
            })
           )
        }).catch((error) => {

           if(error.response){
              props.setError(error.response.data);
           }else{

             props.setError("Oops, something went wrong!");
           }
        })

    }

    useEffect(() => {
    
      /*global google*/
      google.accounts.id.initialize({
       client_id: import.meta.env.VITE_CLIENT_ID,
       callback: handleCallbackResponse
      })

      google.accounts.id.renderButton(
          document.getElementById('googleAuth'),
         {theme: "filled_blue", size: "large", width: 320}
      )
  
      }, [])
    
  return (

    <div id="googleAuth" className='flex justify-center mt-6'></div>
  )
}

export default GoogleAuthButton;