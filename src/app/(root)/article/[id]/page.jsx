import { getSingleArticle } from "@/app/actions";
import LatestArticles from "@/components/LatestArticles";
import Image from "next/image";
import BlogContent from "@/components/ui/BlogContent";

async function page ({params}) {
    const article = await getSingleArticle(params.id);
    return (
        <div className="flex flex-col gap-[2em]">
        <div className="flex flex-col md:flex-row w-full gap-[3em] p-2">
            <div className="md:w-[70%]  w-full flex flex-col gap-[1.5em]">
                <span className="font-raleway flex items-center gap-1">
                    {article.tags.map((tag, idx) => (
                    <span 
                    key={idx}
                     className=" hover:text-purple underline cursor-pointer text-sm uppercase  font-medium">{tag}</span>

                    ))}
                </span>
              <h1 className="text-3xl md:text-4xl font-semibold">{article.title}</h1>
            <div className='flex items-center gap-3'>
          <Image 
          src={article.author.personal_info.profile_img} 
          width='30'
          alt='profile image'
          height='30'
          className='rounded-full '
           />
           <div className=''>
          <h1 className='font-semibold text-sm'>{article.author.personal_info.fullname}</h1>
          <h1 className='text-gray text-sm'>{article.publishedAt.slice(0,10)}</h1>
           </div>
           </div>
           <div className="flex items-center gap-3 border-b border-gray pb-[2em]">
            <p className="text-sm font-raleway font-normal text-gray">Implemet share icons, twitter, facebook, whatsapp, etx</p>
           </div>
            <h1 className="text-xl font-medium italic text-purple">{article.des}</h1>
            <Image
            src={article.banner}
            alt='banner'
            width='2000' 
            height='500'
            className='aspect-video object-cover' />
            <div className="flex w-full flex-col md:flex-row gap-5">
            <div className="md:w-[10%] sticky" > 
             <h1 className='font-bold text-blue-500'>Facebook</h1>
             <h1 className='font-bold text-blue-300'>X(twitter)</h1>
             <h1 className='font-bold text-red'>Pinterest</h1>
            </div>
            <div className="flex w-full flex-col md:w-[90%]">

            {
                article.content[0].blocks.map((block, i) => {
                return (
                <div
                    key={i}
                    className='mt-4'>
                    <BlogContent block={block}  />
                </div>
                )})
                                }
            </div>
            </div>
            </div>
             <div className="md:w-[30%] w-full">
            <LatestArticles />
             </div>
        </div>

        {}
        </div>
    )
}

export default page;