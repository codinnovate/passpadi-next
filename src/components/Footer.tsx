import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logo from '@/assets/logo.png';


const Footer = () => {
  return (
    <div className='w-full bg-secondary mt-[5em]  text-white  min-h-[5em] h-fit'>
      <div className='max-w-5xl mx-auto p-2 flex flex-col items-center  gap-[1em] pt-[3em]'>
    <Link
     className='bg-white  w-[80px] rounded-2xl'
     href='/'>
     <Image
     alt='passpadi' 
     src={logo} 
     className="w-[80px] mr-[2em]" />
     </Link>
        <div className='flex font-light text-sm flex-col items-center justify-between'>
          <div className=''>©2023 Passpadi. All rights reserved.</div>
          <ul className='flex justify-end gap-2'>
            <li><a href='/privacy-policy'>Privacy Policy</a></li>
            <li><a href='#'>Terms of Service</a></li>
          </ul>
        </div>

      </div>
      
    </div>
  )
}

export default Footer