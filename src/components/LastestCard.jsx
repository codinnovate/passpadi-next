import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const LastestCard = ({blog}) => {
  return (
    <Link href={`/article/${blog.blog_id}`} className='flex flex-row items-start  w-full border-b border-gray   min-h-[100px] gap-[1em] py-2'>
      <Image 
       alt=''
       src={blog.banner}
       loading='lazy'
       width='70' 
       height='70'
       className='rounded-[.8em]  max-h-[70px] h-[70px] w-[70px]   object-cover border-radius' 
       />
       <div className='flex flex-col h-full'>
        <h1 className=' font-semibold text-[16px] transition-all'>{blog.title}</h1>
         <h1 className='text-sm font-light mt-[1em]'>by <span className='font-medium  '>{blog.author.personal_info.fullname}</span></h1> 
       </div>
    </Link>
  )
}

export default LastestCard
