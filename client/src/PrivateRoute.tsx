import { useDispatch, useSelector } from "react-redux"
import { RootState } from "./redux/app/store"
import { Navigate, useLocation } from "react-router-dom"

interface Props {
    children : JSX.Element
}

export const PrivateRoute = ({children}:Props) => {
      
    // const {accessToken , refreshToken} = useSelector(
    //     (state:RootState) => state.auth
    // )
   const accessToken = 'ldidneodod';
   const refreshToken = 'dkdiekeidiid';
   
    const dispatch = useDispatch();
    const location = useLocation();

    if(!accessToken && !refreshToken){

        return <Navigate replace to={'/auth/login'} state={{from: location}} />
    }

    return children;
}