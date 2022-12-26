
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import sidebarReducer from '../features/sidebarSlice';
import sidebarMenuReducer from '../features/sidebarMenuSlice';
import WorkSpaceMenuReducer from '../features/WorkSpaceMenu';
import modalsliceReducer from '../features/modalslice';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';


const persistConfig = {
    key: 'root',
    storage,
}

const combinedReducer = combineReducers({
    auth: authReducer,
    sidebar: sidebarReducer,
    sidebarMenu: sidebarMenuReducer,
    WorkSpaceMenu: WorkSpaceMenuReducer,
    modal: modalsliceReducer
})

const persistedReducer = persistReducer(persistConfig, combinedReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
})

export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch