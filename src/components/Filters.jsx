import React from 'react'

const Filters = ({subjectName}) => {
  return (
    <div className='hidden flex-col w-full border mt-[2em] p-5 rounded-2xl'>
        <h1 className='capitalize font-semibold text-2xl '>Filter {subjectName} Questions</h1>
     
      <div className='flex mt-10'>
      <div className='flex w-full gap-2 items-center'>
          <p className='font-semibold'>Exam Type:</p>
          <select className='border rounded-xl p-2 '>
            <option value="all">All</option>
            <option value="multiple-choice">JAMB</option>
            <option value="true-false">POSTUTME</option>
            <option value="essay">WAEC</option>
          </select>
        </div>
        <div className='flex w-full gap-2 items-center'>
          <p className='font-semibold'>Exam Year:</p>
          <select className='border rounded-xl p-2 '>
            <option value="all">All</option>
            <option value="multiple-choice">JAMB</option>
            <option value="true-false">POSTUTME</option>
            <option value="essay">WAEC</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default Filters