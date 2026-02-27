import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogCard = (blog) => {
  return (
    <div className='flex flex-col w-full'>
     <Link href={`/article/${blog.blog_id}`}>
      <Image 
       alt=''
       src={blog.banner}
       loading='lazy'
       width='1000' 
       height='500'
       className='rounded-[.8em]  w-full h-[500px]   object-cover border-radius' 
       />
       </Link>
       <Link href={`/article/${blog.blog_id}`}>
       
       </Link>

       <div className='flex flex-col h-full'>
        <h1 className=' font-semibold text-[16px] transition-all'>{blog.title}</h1>
         <h1 className='text-sm font-light mt-[1em]'>by <span className='font-medium  '>{blog.author.personal_info.fullname}</span></h1> 
       </div>
        
    </div>
  )
}

export default BlogCard