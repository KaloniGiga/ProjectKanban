import {BsSearch} from 'react-icons/bs'
import React from 'react'

interface SearchProps {
  classes?: string,
}

function Search({classes}:SearchProps) {
  return (
    <div className='flex items-center border-2 border-black px-1 py-1 rounded-md'>
        <BsSearch size={20}/>
        <input type="text" className={`outline-none ml-1 ${classes}`}/>
    </div>
  )
}

export default Search