import Input from "../../component/Input/Input"
import Button from "../../component/button/Button"
import GoogleAuthButton from "../../component/GoogleAuth/GoogleAuthButton"
import {useNavigate,Navigate, NavLink} from 'react-router-dom';
import React, {useState} from 'react';
import axiosInstance from "../../http";
import { useDispatch } from "react-redux";
import { loginUser } from '../../redux/features/authSlice';


function RegisterPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState({
     username: '',
     email: '',
     password: '',
     confirmPassword: '',
  });



  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=> {
        setValues({...values, [e.target.name] : e.target.value})
  }


  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = {
          'username': values.username,
          'email': values.email,
          'password': values.password,
          'confirmPassword': values.confirmPassword
        }

        //post the data to the server
        axiosInstance.post('/register', user)
        .then((response) => {
          
            const data = response.data;

            const accessToken = data.token.accessToken;
            const refreshToken = data.token.refreshToken;

            dispatch(loginUser({
              accessToken,
              refreshToken,
              
            }))

            setIsSubmitting(false)
            navigate('/home')
            
        })
        .catch((error) => {
            setIsSubmitting(false);

             if(error.response){
              const message = error.data;
               setError(message);
             }else if(error.request){
              setError("Something went wrong!");
             }else {
               setError("Something went wrong!")
             }
         
        })

  }

  return (
    <div className="flex justify-center items-center bg-surface pt-32 pb-16">
      
      <form onSubmit={handleSubmit} className='  flex flex-col w-full max-w-sm px-8 py-8 mb-8 bg-white drop-shadow-2xl rounded-2xl'>

      <h1 className="font-bold text-center mb-3 text-2xl">Sign Up</h1>

        
        <Input typeName="text" value={values.username} onChange={handleChange} placeholder="Enter you user name" name="username" label="User Name"/>

        <Input typeName="email" value={values.email} onChange={handleChange} placeholder="Enter you email" name="email" label="Email address"/>

        <Input typeName="password" value={values.password} onChange={handleChange} placeholder="Enter you password" name="password" label="Enter Password"/>

        <Input typeName="password" value={values.confirmPassword} onChange={handleChange} placeholder="Confirm your password" name="confirmPassword" label="Confirm Password"/>

        <Button name="Sign Up" color="secondary" hoverColor="secondary_dark" isSubmitting={isSubmitting}/>
        
        <h2 className='text-center w-full border-b-2 border-solid border-black mt-3 mb-3'><span className='px-5 py-5 bg-white text-semibold tracking widest leading-0'>OR</span></h2>

         <GoogleAuthButton setError={setError} />

         <NavLink to='/auth/login' className={'text-center mt-4 hover:text-black text-link font-semibold'}>Already have an account.</NavLink>
      </form>
    </div>
  )
}

export default RegisterPage