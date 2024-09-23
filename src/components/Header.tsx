"use client";


import React, { useState } from 'react'
import logo from  '../assets/logo.png';
import Image from 'next/image';
import Link from 'next/link';

const blogItems = [
  {title: "Home", link: "/"}, 
  // {title: "Cbt", link: "/cbts"}, 
  {title: "English PQ", link: "/subject/english"}, 
  {title: "Mathematics PQ", link: "/subject/mathematics"},  
  {title: "Chemistry PQ", link: "/subject/chemistry"},  
  {title: "Physics PQ", link: "/subject/physics"},   
  {title: "Biology PQ", link: "/subject/biology"},   
  {title: "General Paper PQ", link: "/subject/general-paper"}, 
  
]
const Header = () => {
  const [show, setShow] = useState(false);


  return (
    <header className='w-full flex items-center justify-between px-4 border-b border-gray  gap-5 sticky'>
     <Link href='/'>
     <Image
     alt='passpadi' 
     src={logo} 
     className="w-[100px] mr-[2em]" />
     </Link>

    <nav className='hidden md:flex gap-5  items-center justify-between'>
      {blogItems.map((item, idx) => (
        <Link
         href={item.link} key={idx} className='text-sm font-medium hover:underline  text-secondary  transition-all'>
        <h1>{item.title}</h1>
        </Link>
      ))}
    </nav>
    

    {/* <Navbar /> */}
    <div className='flex items-center gap-2'>

      <Link href='/https://x.com/passpadi'>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.4 7C13.0745 7 12 8.11929 12 9.5C12 9.71132 12.0252 9.91652 12.0726 10.1125C11.9494 10.1208 11.8252 10.125 11.7 10.125C9.67943 10.125 7.90441 8.71734 6.89216 7.06577C6.70202 7.73853 6.6 8.4506 6.6 9.1875C6.6 11.2539 7.40225 13.4376 8.7 14.7941C8.7 15.5294 6.9 15.9021 6 15.9966C7.05902 16.6348 8.28857 17 9.6 17C13.4885 17 16.657 13.7891 16.7953 9.77373L18 7.3125L15.9875 7.625C15.5644 7.23602 15.0087 7 14.4 7Z" stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      </Link>
      <Link href='/https://play.google.com/store/apps/details?id=com.kidscantech.App'>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.9405 12.4311C17.7073 13.3831 16.4665 14.0669 13.9848 15.4344C11.2857 16.9217 9.93612 17.6654 8.84297 17.3789C8.47274 17.2819 8.13174 17.1112 7.84541 16.8797C7 16.1963 7 14.7773 7 11.9394C7 9.10157 7 7.68264 7.84541 6.99915C8.13174 6.76766 8.47274 6.59704 8.84297 6.5C9.93612 6.21349 11.2857 6.95715 13.9848 8.44448C16.4665 9.81199 17.7073 10.4957 17.9405 11.4478C18.0198 11.7717 18.0198 12.1072 17.9405 12.4311Z" stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8 17L16 9.61432M8 7L16 14.3857" stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      </Link>
     <button
      onClick={() => setShow(!show)}
      className='md:hidden'>
     <svg width="24"  height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 5L20 5" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 12L20 12" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 19L14 19" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
     </button>
    </div>
    
     {show && (
      <div className='md:hidden absolute flex flex-col gap-3 top-0 mt-[4em] bottom-0 left-0  bg-secondary w-full min-h-[20em]  h-fit p-5 rounded-b-2xl transition-all '>
        <div className='ml-auto rounded-md bg-white hover:bg-purple w-fit h-fit flex items-center justify-center'>
          <button onClick={() => setShow(false)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 4.99988L5 18.9999M5 4.99988L19 18.9999" stroke="#141B34" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"/>
          </svg>
          </button>
        </div>
      <nav className='flex flex-col mt-[2em] gap-2  justify-between'>
      {blogItems.map((item, idx) => (
        <Link 
        onClick={() => setShow(false)}
        href={item.link} 
        key={idx} 
        className='font-semibold  duration-300 uppercase text-white text-xl hover:text-purple transition-all'>
        <h1>{item.title}</h1>
        </Link>
      ))}
    </nav>
    {/* <Searchbar /> */}
      </div>
     )}
    </header>
  )
}

export default Header