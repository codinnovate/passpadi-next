import React from 'react'

const NavBtn = ({  icon }) => {
  return (
    <button className='flex justify-center items-center w-[4em] rounded-2xl py-3 bg-black/5 hover:bg-black/10 transition-colors'>
     {icon}
    </button>
  )
}

export default NavBtn
