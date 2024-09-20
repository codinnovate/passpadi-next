import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const LastestCardSkeleton = ({blog}) => {
  return (
    <div className='flex flex-row  w-full md:min-w-[300px] md:w-[300px] h-[100px]'>
     <div className='flex flex-col  w-full'>
      <div className='flex items-center w-full'>
        <h1 className='text-blue-200 text-sm capitalize font-semibold'>
          {blog.tags.slice(0,1).map(tag => (
            <span >#{tag.slice(0, 10)}</span>
          ))}
          </h1>
          <div className='bg-black/10 rounded-full w-1 h-1 mx-2' />
        <h3 className='text-black/20  text-sm font-semibold'>4hrs</h3>
      </div>
      <div className=''>
        <h3 className='text-black font-bold'>{blog.title.slice(0, 75)} ..</h3>
      </div>
      </div>
      <Image 
       alt=''
       src={blog.banner}
       loading='lazy'
       width='80' 
       height='80'
       className='rounded-[1em] max-h-[80px] h-[80px] object-cover' 
       />
    </div>
  )
}

export default LastestCardSkeleton
