import { BoardMemberObj } from "../../../types/component.types";
import BoardMember from "./BoardMember";



interface Props {
   boardId: string | undefined,
   workspaceId: string,
   members: BoardMemberObj[],
   role: string
}


function BoardMembers({boardId, workspaceId, role, members}:Props) {
  

  const boardAdmins = members.filter((member:BoardMemberObj) => (member.role === "ADMIN"));
  
  return (
    <div>
       {members.length > 0 ? (
         <div className="flex flex-col items-center">
          {members.map((member:BoardMemberObj) => {

              return <BoardMember
                      key={member._id}
                      boardId={boardId}
                      member={member}
                      boardAdmins={boardAdmins}
                      myRole={role}
                      workspaceId={workspaceId}
                     />
          })}
           
           
         </div>
       ): (
        <div>No Members</div>
       )}

    </div>
  )
}

export default BoardMembers;