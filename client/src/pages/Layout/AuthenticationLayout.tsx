import { RootState } from '../../redux/app/store';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';


function AuthenticationLayout() {
      
    const {accessToken, refreshToken} = useSelector(
        (state : RootState) => state.auth);
    
    if(!accessToken || !refreshToken) {
          <Navigate to={'/login'} />
    }else{
         <Navigate to={'/home'} />
    }

  return (

    <div className='w-screen h-screen overflow-y-auto'>
       <Outlet />
    </div>
  )
}

export default AuthenticationLayout;