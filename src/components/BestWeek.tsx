import { fetchLatestArticles } from '@/app/actions';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

async function BestWeek() {
  const data = await fetchLatestArticles(1);
    
  return (
    <Link
     href={`/article/${data?.[0].blog_id}`}
     className="flex flex-col gap-3 w-full h-full md:min-w-[67%]">
       <Image
        src={data?.[0]?.banner} 
        width='2000'
        height='400'
        alt="Best of the Week"
        className="w-full border aspect-video md:min-h-[450px] md:h-[450px]"
      />
        <h1 className="text-xl font-semibold hover:text-red-600 transition-all">
          {data?.[0]?.title} {/* Access the first item of the array */}
        </h1>
        <div className='flex items-center gap-3'>
          <Image 
          src={data?.[0].author.personal_info.profile_img} 
          width='30'
          alt='profile image'
          height='30'
          className='rounded-full '
           />
           <div className=''>
          <h1 className='font-semibold text-sm'>{data?.[0].author.personal_info.fullname}</h1>
          <h1 className='text-gray text-sm'>{data?.[0]?.publishedAt.slice(0,10)}</h1>
           </div>
        </div>
    </Link>
  );
}

export default BestWeek;
