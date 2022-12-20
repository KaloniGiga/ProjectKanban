
import React, {useState} from 'react'
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { ListObj } from '../../../types/component.types';
import { CardObj } from '../../../types/component.types';
import Options from '../../Options/Options';
import OptionsItem from '../../Options/OptionsItem';
import Card from './Card';
 
interface Props {
    list: ListObj;
    cards: CardObj[];
    boardId: string | undefined;
    workspaceId: string;
    role: string;
}

function List({list, cards, boardId, workspaceId, role}:Props) {
 
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const [isOpen, setIsOpen] = useState();
    const [show, setShow] = useState(false);
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    
    const deleteList = () => {}

    

  return (

    <div>
        <header>
            <h3>
                {list.name.length > 30 ? list.name.slice(0,30) + '...' : list.name}
            </h3>
           
            {(role == "ADMIN" || role == "NORMAL") && (
              <>
                <button
                onClick={({nativeEvent}) => {
                    setCoordinates({
                        x: nativeEvent.pageX,
                        y: nativeEvent.pageY
                    });

                    setShow((prevValue) => !prevValue)
                }}
               
                >
                    <HiOutlineDotsHorizontal size={20} />
                </button>

                {show && (
                    <Options>
                      <>
                       <OptionsItem />
                       <OptionsItem />
                     </>
                    </Options>
                )}
             </>
            )}
           
        </header>

        <div>
           <ul>
            {cards.map((card, index) => (
                <Card 
                key={card._id}
                card={card}
                role={role}
                workspaceId={workspaceId}
                boardId={boardId}
                />
            ))}
             
           </ul>
        </div>
    </div>
  )
}

export default List;