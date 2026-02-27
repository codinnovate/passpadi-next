import { getAllSubjects } from '@/app/actions'
import Link from 'next/link';
import React from 'react'

function getRandomColor() {
  const letters = 'CEE3456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

async function PastQuestions() {
  // const subjects = await getAllSubjects();
  const subjects = [
    {name:"mathematics"},
    {name:"english"},
    {name:"general-paper"},
    {name:"chemistry"},
    {name:"physics"},
  ]
  
  return (
    <div className='flex flex-col gap-3'>
      <h1 className='text-2xl font-extrabold my-[2em]'>Study official Past Questions</h1>
      <div className='flex flex-wrap gap-5 bg-red-700 '>
        {subjects.map((subject, idx) => (
          <Link
            href={`subject/${subject.name}`} 
            key={idx} 
            className='flex cursor-pointer underline transition-all delay-100 ease-in-out hover:-ml-2 hover:-mr-2 md:hover:-mt-2 justify-between  items-center px-2 w-[20em]'
          >
             
              <h2 className='font-semibold text-black ml-[1em]'>{subject.name}</h2> 
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PastQuestions;
