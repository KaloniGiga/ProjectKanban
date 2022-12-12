
import {createSlice, PayloadAction } from '@reduxjs/toolkit';


interface WorkSpaceState {
   currentActiveWorkSpace: string | null
}


const initialState:WorkSpaceState = {
    currentActiveWorkSpace: null
}


const WorkSpaceMenu =  createSlice({
    name: 'workSpaceMenu',
    initialState,
    reducers: {

        setCurrentActiveWorkSpace : (state, action: PayloadAction<string | null>) => {
             state.currentActiveWorkSpace = action.payload;
        }
    }
})


export const {setCurrentActiveWorkSpace} = WorkSpaceMenu.actions;

export default WorkSpaceMenu.reducer;

