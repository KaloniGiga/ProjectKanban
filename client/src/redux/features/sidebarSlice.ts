
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface SidebarType{
    show:boolean
}

const initialState:SidebarType = {
    show: true
}


const sidebarSlice = createSlice({
     name:'sidebar',
     initialState,
     reducers: {
         
         hideSidebar: (state) => {
              state.show = false
         },

         showSidebar: (state) => {
            state.show = true
         }
     }
});

export const {hideSidebar, showSidebar} = sidebarSlice.actions;
export default sidebarSlice.reducer;