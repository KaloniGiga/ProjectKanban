import { MemberObj } from "../../../types/component.types";



interface Props {
   boardId: string,
   workspaceId: string,
   members: MemberObj[],
   role: string
}


function BoardMembers({boardId, workspaceId, role, members}:Props) {
  
  return (

    <div>
       {members.length > 0 ? (
         <div>
           
         </div>
       ): (

       )}

    </div>
  )
}

export default BoardMembers;