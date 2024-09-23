import { getAllSubjects, getQuestionsBySubject } from "@/app/actions";
import Link from "next/link";
import parse from 'html-react-parser';
import Filters from "@/components/Filters";
import ExamPreps from "@/components/ui/ExamPreps";


const preps = [
    {title:"JAMB Prep", image:'', link:'/jamb-preps', className:'bg-[#17cac0]'},
    {title:"Post Jamb Prep", image:'', link:'/jamb-preps', className:'bg-[#0074e1]'},
    {title:"GCE Prep", image:'', link:'/jamb-preps', className:'bg-[#0c0c0c]'},
    {title:"NECO Prep", image:'', link:'/jamb-preps', className:'bg-[#ffa731]'},
    {title:"WAEC Prep", image:'', link:'/jamb-preps', className:'bg-[#64c573]'},
  ]

async function page ({ params }){
    
    const subjects = await getAllSubjects();
    if (!params.subject) return null;
    const questions = await getQuestionsBySubject(params.subject);
    const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

    return (
    <div className="flex flex-col md:flex-row gap-[3em]">

    <div className="flex flex-col gap-[2em]">
        <Filters  
        subjectName={params.subject}
         />
        <div className="">
        {questions && questions.map((question, index) => (
        <div
         key={index}
        className="border-b  mb-5">
        <span className="text-white bg-red-500 rounded-full  text-sm font-bold w-7 h-7">
            {index + 1}
        </span>
        <div className="flex  flex-col">
            <h3 className='text-sm font-bold underline'>
                <i>
                    {question?.instruction}
                </i>
            </h3>
                <h2 className="text-xl flex mt-3  font-medium ">{parse(`${question.question}`)}
            </h2>
        <div className='flex flex-col  gap-2 mt-3 border  p-3 rounded'>
            {question.options.map((option, index) => (
                    <div 
                    key={index}
                    className='flex gap-2'>
                    <h1 className='font-bold'>{optionLabels[index]}. </h1><h1 className="raleway capitalize" key={index}>{parse(`${option}`)}</h1>
                    </div>
            ))}
        </div>
         <div className='w-full flex items-center my-3 justify-between'>
                <Link href={`${params.subject}/${question._id}`}
                    className='border transition-all    rounded-xl px-2 py-1.5 text-black hover:text-white hover:bg-black'>
                <h1 className='text-sm  font-semibold capitalise '>View Answer</h1>
                </Link>
                
                <span className='bg-yellow-300 p-1 text-black flex items-center rounded-tl-md  rounded-none'>
                    <span className='flex gap-2 text-sm ml-3 font-medium'>{question.examType} <span className="ml-2">{question.examYear}</span></span>
                </span>
                {/* {question.school && (
                    <span className='bg-green-300 p-1 text-black flex items-center rounded-tl-md  rounded-none'>
                    <span className='flex gap-2 text-sm ml-3 font-medium'>{question.school.name}</span>
                </span>
                )} */}
            </div>

      

        
        </div>
        </div>
    ))}
        </div>



     </div>
        <div className='flex flex-col mt-[2em] gap-[1em] '>
        <div className='flex flex-col mt-[2em] gap-[1em] '>
        <h2 className="bg-black p-5 text-white text-xl rounded-xl">All Subjects</h2>
        {subjects && subjects.map((subject, idx) => (
          <Link
            key={idx} 
            href={`/subject/${subject.subject_id}`} 
            className='flex cursor-pointer underline transition-all delay-100 ease-in-out   justify-between  items-center hover:opacity-[0.5] px-2 w-[20em]'
          >
             
              <h2 className='font-semibold text-black ml-[1em]'>{subject.name}</h2> 
          </Link>
        ))}
      </div>
      
      <div className='flex flex-col mt-[2em] gap-[1em] '>
        {preps.map((exam, idx) => (
            <ExamPreps
            key={idx} 
            exam={exam}
            />
        ))}
      </div>
      </div>
      
    </div>
    )
}


export default page;