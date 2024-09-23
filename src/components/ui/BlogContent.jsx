import React from 'react'
import Image from 'next/image'





const Quote = ({ quote, caption }) => {
    return (
        <div className=' p-3 pl-5 border-l  border-gray-100'>
            <p className=' text-black/90 text-sm' dangerouslySetInnerHTML={{__html:quote}}></p>
            {caption.length ?
                <p className='w-full text-black/90 text-base'>{caption}</p> : ""}
        </div>
    )
}


const List = ({ style, items }) => {
    return (
        <ol className={`pl-5 ${style == "ordered" ? "list-decimal" : "list-disc"}`}>
            {
                items.map((listItem, i) => {
                    return <li key={i} className='my-1 font-medium' dangerouslySetInnerHTML={{__html:listItem}}></li>
                })
            }
        </ol>
    )

}
const BlogContent = ({ block }) => {
    let { type, data } = block;

    if (type == "paragraph") {
        return <p className='' dangerouslySetInnerHTML={{__html:data.text}}></p>
    }
    if(type == "embed"){
        return (
            <div className='flex justify-center items-center'>
                <iframe title='video' className='w-full aspect-video h-64' src={data.embed}></iframe>
            </div>     
        )
    }
    if (type == "header") {
        if (data.level == 3) {
            return <h3 className='text-xl font-raleway font-semibold underline' dangerouslySetInnerHTML={{__html:data.text }}></h3>
        }
        return <h2 className='text-2xl mt-3 font-bold font-raleway' dangerouslySetInnerHTML={{__html:data.text }}></h2>

        
    }
    if (type == "image") {
        return (
            <div className=''>
                <Image
                 src={data.file.url}
                 className='aspect-video'
                 width='700'
                 height='500' 
                    />
                {data.caption.length ? <p className='w-full text-ceneter my-3 md:mb-12 text-base text-dark-grey'>{data.caption}</p> : ''}
            </div>     
        )
    }

    if (type == "quote") {
        return <Quote
            quote={data.text}
            caption={data.caption} />
    }
    if (type == "list") {
        return <List style={data.style} items={data.items} />
    }
    else {
        return <h1>this is a block</h1>
    }
   
}

export default BlogContent
