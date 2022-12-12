
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import LandingPage from './pages/LandingPage/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import {ToastContainer} from 'react-toastify';
import ResetPassword from './pages/auth/ResetPassword'
import ForgotPassword from './pages/auth/ForgotPassword'
import AuthenticationLayout from './pages/Layout/AuthenticationLayout'
import { PrivateRoute } from './PrivateRoute'
import MainLayout from './pages/Layout/MainLayout';
import VerifyEmail from './pages/emailVerification/VerifyEmail'
import { useState } from 'react';
import {Suspense, lazy} from 'react';
import WorkSpaceLayout from './pages/Layout/WorkSpaceLayout';
import Error404 from './pages/Error/Error404';
import Sidebar from './component/Sidebar/Sidebar';
import WorkSpaceBoards from './component/Board/WorkSpace/WorkSpaceBoards';
import WorkSpaceMembers from './component/Board/WorkSpace/WorkSpaceMembers';
import WorkSpaceSettings from './component/Board/WorkSpace/WorkSpaceSettings';

import SelectMembersAsync from './component/SelectMembersAsync/SelectMembersAsync';
import { useDispatch } from 'react-redux';
import { showModal } from './redux/features/modalslice';

const HomePage = lazy(() => import ( './pages/LandingPage/HomePage'));
const Board = lazy(() => import('./component/Board/BoardDetail'));


function App() {
   const [show , setShow] = useState(true);

  const handleClick = () => {
       setShow(!show);
  }

  const dispatch = useDispatch();

  return (
    <div>
       
       <BrowserRouter> 
         <Suspense fallback={<div>Loading...</div>}>
         <Routes>
          
             {/* Authentication Route */}
          <Route path="sidebar" element={<Sidebar show={show} onClick={handleClick}/>} />
          <Route path="selectMember" element={ <SelectMembersAsync /> } />

         
          
          <Route path='auth' element={<AuthenticationLayout />}>

          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<RegisterPage />} />
          <Route path='forget/password' element={<ForgotPassword />} />
          </Route>
                {/* Reset Password */}
          <Route path='reset/password/:token' element={<ResetPassword />} />
          <Route path='email/verify/:token' element={<PrivateRoute><VerifyEmail /></PrivateRoute>} />
          
          <Route path='/' element={<LandingPage />} />

          <Route path='home' element={<PrivateRoute><MainLayout /></PrivateRoute>} >
         
              <Route index element={<HomePage />} />
              <Route path='showModal' element={<button onClick={() => dispatch(showModal({modalType: "CONFIRM_REMOVE_WORKSPACE_MEMBER_MODAL"}))}>Show Modal</button>} />
              {/* <Route path='settings' element={<Setting />} /> */}

              <Route path='workspace' element={<WorkSpaceLayout />}>
              
                  <Route path=':id/boards' element={<WorkSpaceBoards />}></Route>
                  <Route path=':id/members'element={<WorkSpaceMembers />}></Route>
                  <Route path=':id/setting' element={<WorkSpaceSettings />}></Route>
              </Route>

              <Route path='board/:id' element={<Board />} />
              <Route path='*' element={<Error404 />} />
         
          </Route>
          
          

          <Route path='*' element={<Navigate to={'/auth/login'} replace={true} />} />

         </Routes>
         </Suspense>
      </BrowserRouter>

      </div>
  )
  
}

export default App;
