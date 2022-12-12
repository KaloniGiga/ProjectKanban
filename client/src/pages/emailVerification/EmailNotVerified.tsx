
import React from 'react'
import Input from '../../component/Input/Input'
import {useState} from 'react'
import Button from '../../component/button/Button'
import axiosInstance from '../../http';

function EmailNotVerified() {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
   const [values, setValues] = useState({
          email: ''
   })

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

      setValues({...values, [e.target.name]:e.target.value});
   }
   
  

   const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
       
       const data = {
        'email' : values.email
       }

       axiosInstance.post('', data)
       .then((response) => {
           
          console.log(response.data);
          
       }).catch((error) => {
          
           if(error.response){

            console.log(error.message);
           }else{

             console.log("Oops something went wrong")
           }


       })
   }

  return (
    <div className='h-full flex justify-center items-center bg-surface'>
      <div className='flex flex-col w-full max-w-md px-8 bg-white rounded-2xl drop-shadow-xl py-6 border-2'>
        <h3 className='text-center font-semibold text-xl mb-3'>Activate your account.</h3>
        <p className='mb-3 text-primary_dark'>A link has been sent to you email. Your account will be activated after
          your verify your Email.
        </p>
        <p className='text-primary_dark mb-3'>If you don't see any email in your inbox or spam. Resend it.</p>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <Input typeName='email' name='email' placeholder='Enter your email' label='Email Address' onChange={handleChange} value={values.email}/>

          <Button name='Resend' color='secondary' hoverColor='secondary_dark' isSubmitting = {isSubmitting}/>
        </form>
      </div>
    </div>
  )
}

export default EmailNotVerified