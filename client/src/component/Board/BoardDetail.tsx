import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axiosInstance from "../../http";
import { RootState } from "../../redux/app/store";
import { Board } from "../../types/component.types";
import BoardLists from "./BoardLists/BoardLists";
import BoardMembers from "./BoardMembers/BoardMembers";
import BoardMenu from "./BoardMenu/BoardMenu";
import BoardName from "./BoardName/BoardName";
import BoardVisibility from "./Boardvisibility/BoardVisibility";
import InviteBtn from "./InviteBtn/InviteBtn";
import JoinBtn from "./JoinBtn/JoinBtn";
import {DndProvider} from 'react-dnd';
import  {TouchBackend} from 'react-dnd-touch-backend';
import Loader from "../Loader/loader";


function BoardDetail() {

    const {id} = useParams();
    const queryClient = useQueryClient();
    const {user} = useSelector((state:RootState) => state.auth);
    
    const [showMenu, setShowMenu] = useState(true);

    useEffect(() => {
        queryClient.invalidateQueries(["getRecentBoards"])
    }, []);
    
    const addToFavorite = (boardId:string, workSpaceId:string) => {
        
    }

    const removeFavorite = (boardId:string, workSpaceId:string) => {

    }

    const getBoard = async ({querykey}:any) => {
         const response  = await axiosInstance(`boards/${querykey[1]}`);
         const data = response.data;
         console.log(data.board);
         return data.board;
         
    }

     const {isLoading, data:board, error} = useQuery<Board | undefined, any, Board, string[]>(["getBoard", id!], getBoard);


     if(isLoading){
          return (
            <div className="flex w-full justify-center items-center">
              <Loader />
            </div>
          )
     }


     if(error){
          return (
            <div className="flex w-full items-center justify-center">
              <h3>Oops! something went wrong</h3>
              <button>Retry</button>
            </div>
          )

     }


  return (

    <div className="h-full bg-black relative">
       {board && (
         <>
            <div className="overlay absolute top-0 bottom-0 right-0 left-0"
            style={{
              backgroundImage: `url(${board.bgImage})`,
              backgroundColor: !board.bgImage ? board.color : "",
              zIndex: 1,
              backgroundPosition: '50%',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundBlendMode: 'overlay',
              boxShadow: `0 0 0 2000px rgba(150, 150, 150, 0.3)`
            }}>
              
            </div>

            <div className="flex flex-col relative z-10">
              <div className="header h-16 w-full px-4 py-2 flex items-center justify-between z-10 bg-white">
                 <div className="flex items-center flex-1 gap-x-4">
                   {board.role === "ADMIN" ? (
                     <BoardName
                      workspaceId={board.workspace._id}
                      boardId={id}
                      value={board.name} />

                   ):(
                    <div className="shadow rounded px-2 py-1 bg-surface">
                      {board.name}
                    </div>

                   )}

                   <div>
                     {board.isFavorite ? (
                      // unfavorite
                      <div> 


                       </div>

                     ):(
                     // favorite
                      <div>


                      </div>
                     )}
                   </div>

           {/* workspace name */}
                   <div>
                     {board.workspace.name}
                   </div>

            {/* board visibility */}
               <div>
                 {board.role === "ADMIN" ? (
                    <BoardVisibility workspaceId={board.workspace._id} boardId={id} options = {[ "PUBLIC", "PRIVATE"]} visibility = {board.visibility} />
                 ): (
                    <div>
                      {board.visibility}
                    </div>
                 )}
               </div>

                <BoardMembers boardId={id} workspaceId={board.workspace._id} members={board.members} role={board.role} />

                {board.role === "ADMIN" && (
                  <>
                   <InviteBtn />
                  
                   {!board.members.find((member:any) => member._id === user?._id) && (
                      <JoinBtn />
                   )}
                   </>
                )}

                {board.role === "NORMAL"  && (
                  <>
                    {!board.members.find((member: any) => member._id === user?._id) ? (
                      <JoinBtn />
                    ): (
                      <InviteBtn />
                    )}
                  </>

                )}
                 </div>
               {/* menu bar */}
                  <div>
                     <button 
                     onClick={() => setShowMenu(!showMenu)}>{showMenu ? 'Show Menu' : 'Hide Menu'}</button>
                  </div>

              </div>

              {showMenu && (
                 <BoardMenu />
              )}

            </div>

            <div>
              
               {/* <BoardLists boardId={id} workspaceId={board.workspace._id} myRole={board.role}/> */}
              
            </div>
           
          </>
       )}
  
    </div>
  )
}

export default BoardDetail;