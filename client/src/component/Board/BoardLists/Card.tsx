import React from 'react'
import { CardObj, LabelObj } from '../../../types/component.types'

interface Props {
  boardId: string | undefined,
  workspaceId: string,
  role: string,
  card: CardObj

}


function Card({boardId, workspaceId, role, card}:Props) {


  return (

    <li>
    {/* card cover */}
       {
        card.coverImage ? (
            <img src={card.coverImage} />
        ): (
            <div>

            </div>
        )
       }

       {/* card label */}
       {card.labels && (
          <div>
            {card.labels.map((label:LabelObj) => (
                <div>
                    {label.name && label.name.length > 25 ? label.name.slice(0,25) + '...' : label.name }
                </div>
            ))}
          </div>
       )}

       <div>
        {card.name.length > 50 ? card.name.slice(0,50) + '...' : card.name}
       </div>
      
      {/* bottom */}
       
    </li>
  )
}

export default Card