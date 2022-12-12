
import React from 'react'
import Input from '../../component/Input/Input';
import Button from '../../component/button/Button';
import { useState } from 'react';
import axiosInstance from '../../http';


function ForgotPassword() {
   
       const [isSubmitting, setIsSubmitting] = useState(false);
       const [error, setError] = useState("");
       const [values, setValues] = useState({
                 email: ""
       })


       const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
           setValues({...values, [e.target.name]: e.target.value})
       }


       const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
           
        const data = {
          'email': values.email,
        }

      axiosInstance.post(`/password/forget`, data)
      .then((response) => {
         const data = response.data;

         console.log(data);
      })
      .catch((error) => {
         
          if(error.response){
             console.log(error.response)
          }else{
            console.log("something went wrong!")
          }
      })

       }

  return (
    <div className="h-full bg-surface flex justify-center items-center">
      
    <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm px-8 py-6 bg-white drop-shadow-2xl rounded-2xl">
      <h3 className="text-center mb-2 text-xl font-semibold">Find you email</h3>
      <p className='mb-3 text-md text-primary'>A link will be sent to email. Check your inbox after submitting.</p>

      <Input typeName="password" placeholder="Enter your Email" name="email" label="Email Address" onChange={handleChange} value={values.email}/>

      <Button name="Submit" color="secondary" hoverColor="secondary_dark" isSubmitting={isSubmitting}/>
    </form>
  </div>
  )
}

export default ForgotPassword