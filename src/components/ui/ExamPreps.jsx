import Link from 'next/link'
import React from 'react'


const ExamPreps = ({exam}) => {
  return (
    <div className={`${exam.className}  flex w-full min-w-[300px] rounded-2xl hover:opacity-[0.5] transition-all  p-2`}>
        <div className='h-full flex flex-col '>
            <h1 className={`text-xl font-semibold  uppercase text-white `}>{exam.title}</h1>
            <button className='flex items-center gap-1'>
                <span className='bg-white w-[2em] h-[2em] p-1 rounded-full'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7.00012L6 18.0001" stroke="#141B34" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M11 6.13151C11 6.13151 16.6335 5.65662 17.4885 6.51153C18.3434 7.36645 17.8684 13 17.8684 13" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </span>
                <Link 
                href={exam.link} className="uppercase text-white">
                Learn More
                </Link>
            </button>
        </div>
        <div className='pattern'>
        </div>
    </div>
  )
}

export default ExamPreps