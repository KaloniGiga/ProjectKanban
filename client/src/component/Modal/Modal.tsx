
import React from 'react'
import { useDispatch } from 'react-redux'
import {MdClose} from 'react-icons/md'
import CreateWorkSpaceModal from '../ModalComponents/CreateWorkSpaceModal'
import CreateBoardModal from '../ModalComponents/CreateBoardModal';
import InviteWorkSpaceMemberModal from '../ModalComponents/InviteWorkSpaceMemberModal';
import ConfirmRemoveWorkSpaceMemberModal from '../ModalComponents/ConfirmRemoveWorkSpaceMemberModal'
import ConfirmDeleteWorkSpaceModal from '../ModalComponents/ConfirmDeleteWorkSpaceModal';
import ConfirmDeleteBoardModal from '../ModalComponents/ConfirmDeleteBoardModal';
import ConfirmLeaveWorkSpaceModal from '../ModalComponents/ConfirmLeaveWorkSpaceModal';
import ConfirmLeaveBoardModal from '../ModalComponents/ConfirmLeaveBoardModal';
import ConfirmRemoveBoardMemberModal from '../ModalComponents/ConfirmRemoveBoardMemberModal';
import CreateCardModal from '../ModalComponents/CreateCardModal';
import BoardLabelModal from '../ModalComponents/BoardLabelModal';
import { hideModal } from '../../redux/features/modalslice';


interface ModalProps {
    modalType: string | null,
    modalProps?: {},
    title?: string,
    showCloseBtn?: boolean,
    textColor?: string,
    bg ?: string,
}

function Modal({modalType, modalProps, title, showCloseBtn, textColor, bg}:ModalProps) {

    const dispatch = useDispatch();

    const handleClose = () => {
      console.log(showCloseBtn)
       dispatch(hideModal());
    }
    
    let Component: React.FC<any> | null = null;

    switch(modalType) {
        case "CREATE_WORKSPACE_MODAL":
            Component = CreateWorkSpaceModal;
            break;
        case "CREATE_BOARD_MODAL":
            Component = CreateBoardModal;
            break;
        case "INVITE_WORKSPACE_MEMBER_MODAL":
          Component = InviteWorkSpaceMemberModal;
          break;
        case "CONFIRM_REMOVE_WORKSPACE_MEMBER_MODAL":
          Component = ConfirmRemoveWorkSpaceMemberModal;
          break;
        case "CONFIRM_DELETE_WORKSPACE_MDOAL":
          Component = ConfirmDeleteWorkSpaceModal;
          break;
        case "CONFIRM_DELETE_BOARD_MODAL":
          Component = ConfirmDeleteBoardModal;
          break;
        case "CONFIRM_LEAVE_WORKSPACE_MODAL":
          Component = ConfirmLeaveWorkSpaceModal;
          break;
        case "CONFIRM_LEAVE_BOARD_MODAL":
          Component = ConfirmLeaveBoardModal;
          break;
        case "CONFIRM_REMOVE_BOARD_MEMEBER_MODAL":
          Component = ConfirmRemoveBoardMemberModal;
          break;
        case "CREATE_CARD_MODAL":
          Component = CreateCardModal;
          break;
        case "BOARD_LABEL_MDOAL":
          Component = BoardLabelModal;
          break;
        default:
          Component = null;
    }

  

  return (

    <div className='fixed top-0 bottom-0 left-0 right-0 z-20 flex justify-center items-center w-full h-full bg-black bg-opacity-60 m-auto overflow-x-auto overflow-y-auto'
     style={{ maxHeight: "100vh"}}>

       <div className='absolute top-20 flex flex-col items-center'>
        <div className='rounded bg-primary_light flex flex-col pb-10 p-2' style={{
             backgroundColor: bg ? bg : 'inherit',
             color: textColor ? textColor : "inherit",
             width: '100vw',
             maxWidth: '50vw',
             minWidth: '30vw'
        }}>

         <div className='header flex justify-between items-center wrap mb-3'>
         { title && (       
                    <h1 className={`text-xl font-semibold p-2 pl-4`}>{title}</h1>   
                )
          }

            {showCloseBtn === true && (
              <button onClick={handleClose} type="button"
               className='flex-end ml-auto rounded bg-white bg-opacity-50 p-1 bg-surface hover:bg-primary_light'>
                <MdClose size={25}/>
              </button>
            )}
   
         </div>

         <div className='w-full overflow-x-auto'>
            {Component !== null && <Component {...modalProps} />}
         </div>
         </div>
       </div>

    </div>
  )
}

export default Modal;
