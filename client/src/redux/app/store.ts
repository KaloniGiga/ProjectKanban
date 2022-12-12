
import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import sidebarReducer from '../features/sidebarSlice';
import sidebarMenuReducer from '../features/sidebarMenuSlice';
import WorkSpaceMenuReducer from '../features/WorkSpaceMenu';
import modalsliceReducer from '../features/modalslice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        sidebar: sidebarReducer,
        sidebarMenu: sidebarMenuReducer,
        workSpaceMenu: WorkSpaceMenuReducer,
        modal : modalsliceReducer,
    },
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch