import React from "react"


export const  Button = ({title}:{title:string}) => {
    return (
       <button className="bg-black hover:opacity-[0.8] transition-all px-2 py-1.5 text-white">
         {title}
       </button>
    )
  }
