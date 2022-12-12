
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { timeUntilStale } from "react-query/types/core/utils";
import { ModuleNamespace } from "vite/types/hot";


interface modalObj {
    modalType: string | null,
    modalProps?: {},
    title?:string,
    showCloseBtn?: boolean,
    bg?: string,
    textColor?: string
}


const initialState:modalObj = {
     modalType: null,
     modalProps: {},
     title: "",
     showCloseBtn: true,
     bg: "white",
     textColor: 'black'
}


const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {

        showModal: (state, action: PayloadAction<modalObj>) => {
             
            const modal = action.payload;

            state.modalType = modal.modalType;

            if(modal.modalProps){
                state.modalProps = modal.modalProps;
            }

            if(modal.title){
                state.title = modal.title;
            }

            if(modal.bg){
                state.bg = modal.bg;
            }

            if(modal.textColor){
                state.textColor = modal.textColor
            }

           if(modal.showCloseBtn){
               state.showCloseBtn = modal.showCloseBtn;
           }

        },

        hideModal: (state) => {
            state.bg = "white";
            state.showCloseBtn = true;
            state.modalProps = {};
            state.modalType = null;
            state.textColor = "black";
            state.title = "";
        },
    }
})


export const {showModal, hideModal} = modalSlice.actions;

export default modalSlice.reducer;