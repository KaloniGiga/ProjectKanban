
import React, {useEffect} from 'react'
import Options from '../Options/Options';

interface Props {
  label: string,

  options: {
    value: string,
    name: string
  }[],
  
  changeVisibility: (e:React.ChangeEvent<HTMLSelectElement>) => void,
  value: string,
  defaultVisibility: string | undefined
}

function SelectBoardVisibility({label, options,defaultVisibility, changeVisibility, value}:Props) {

   useEffect(() => {
     if( options && options.length > 0 && !value ){
        const isAvailable = defaultVisibility ? options.find((option) => option.value === defaultVisibility) : undefined

        if(isAvailable){
           
        }else {

        }
     }
   },[options])

  return (

    <div className={`flex flex-col mb-3`}>
      
      <div className='flex flex-col justify-center'>

        <label htmlFor="boardVisibility" className='font-md mb-2 font-semibold'>{label}</label>

        <select  name="boardVisibility" id="boardVisibility" disabled={options.length === 0} className="px-2 py-1 border-2 border-black focus:boarder-2 focus:border-primary" onChange={changeVisibility}>
          {options && options.map((option) => (
             <option key={option.value} value={option.value}>{option.name}</option>
          ))}
        </select>
      </div>

    </div>
  )
}

export default SelectBoardVisibility;