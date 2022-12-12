
import {createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserObj } from '../../types/component.types';


interface Tokens {
    accessToken: string;
    refreshToken: string;
}

interface AuthState {
   accessToken: string | null;
   refreshToken: string | null;
   user:  UserObj | null
}


const initialState:AuthState = {
    accessToken: null,
    refreshToken: null,
    user:  null
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
         loginUser: (state, action: PayloadAction<Tokens>) => {
              
            const {accessToken, refreshToken} = action.payload;

            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
 
         },


         logOutUser: (state) => {

            state.accessToken = null;
            state.refreshToken = null;
            state.user = null;
            
         },

         setCurrentUser: (state, action: PayloadAction<UserObj>) => {
             state.user = action.payload;
         }
    }
});

export const {
    loginUser,
    logOutUser,
    setCurrentUser
} = authSlice.actions;

export default authSlice.reducer;