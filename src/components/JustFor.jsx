import { fetchLatestArticles } from '@/app/actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'



async function JustFor(){
  let blogs;
  try {
    blogs = await fetchLatestArticles();
  } catch (error) {
    console.error('Error fetching articles:', error);
    blogs = []; // Set to an empty array on error to prevent crashing
  }

  // Check if blogs is an array before slicing
  const article = Array.isArray(blogs) ? blogs.slice(5, 20) : [];

  if (article.length === 0) {
    return <p>Loading...</p>; // Display loading message if no articles
  }
  return (
    <div className='flex flex-col'>
        <h1 className='text-secondary text-2xl font-bold '>Just For You</h1>

        <div className='flex flex-col  md:grid md:grid-cols-3 mt-[2em]  w-full gap-[3em]'>
          {article?.map((article, idx) => (
            <div key={idx} className='flex flex-col w-full gap-[1em]'>
            <Link href={`/article/${article.blog_id}`}>
             <Image 
              alt=''
              src={article.banner}
              loading='lazy'
              width='500' 
              height='200'
              className='rounded-2xl  w-full h-[300px]   object-cover border-radius' 
              />
              </Link>
              <span className='flex gap-3'>
                {article?.tags?.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className='uppercase text-xs text-purple hover:text-gray-500 cursor-pointer'>#{tag.slice(0, 10)}</span>
                ))}
              </span>
              <Link href={`/article/${article.blog_id}`}> 
              <div className='flex flex-col h-full'>
               <h1 className=' font-semibold text-[16px] transition-all'>{article.title}</h1>
              </div>
              </Link>
       
               
           </div>
          ))}

        </div>
    </div>
  )
}

export default JustFor