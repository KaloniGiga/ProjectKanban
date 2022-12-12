import Input from "../../component/Input/Input";
import React, {useState} from 'react'
import Button from "../../component/button/Button";
import axiosInstance from "../../http";
import { useParams } from "react-router-dom";

function ResetPassword() {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({
      password: "",
      confirmPassword: "",
  })

  const params = useParams();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       setValues({...values, [e.target.name]:e.target.value});
  }


  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
         
          const data = {
            'password': values.password,
            'confirmPassword': values.confirmPassword
          }

        axiosInstance.post(`/password/reset/${params.token}`, data)
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
        <h3 className="text-center mb-2 text-xl font-semibold">Reset your password.</h3>

        <Input typeName="password" placeholder="Enter New Password" name="NewPassword" label="New Password" onChange={handleChange} value={values.password}/>
        <Input typeName="password" placeholder="Confirm Password" name="ConfirmPassword" label="Confirm Password" onChange={handleChange} value={values.confirmPassword}/>

        <Button name="Submit" color="secondary" hoverColor="secondary_dark" isSubmitting={isSubmitting}/>
      </form>
    </div>
  )
}

export default ResetPassword