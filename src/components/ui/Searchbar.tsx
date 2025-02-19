import React from 'react'

const Searchbar = () => {
  return (
    <div className='flex rounded-md  items-center w-full  bg-gray-100 border px-3 py-1' >
    
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5 17.5L22 22" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
    <input
    type='text'
    placeholder='Articles, Study Hacks, Questions'
    className='w-full   placeholder:text-secondary/70 bg-inherit font-semibold  outline-none px-2 py-1 rounded-xl'    
    />

    </div>
  )
}

export default Searchbar
