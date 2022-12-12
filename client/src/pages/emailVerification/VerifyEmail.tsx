
import React,{useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../http';

function VerifyEmail() {

  const params = useParams();

  useEffect(() => {
         
    axiosInstance.post('/')
    .then(() => {

    }).catch(() => {


    })

  }, [])


  return (
    <div></div>
  )
}

export default VerifyEmail;