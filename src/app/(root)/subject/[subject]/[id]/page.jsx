import { getQuestion } from "@/app/actions";
import LatestArticles from "@/components/LatestArticles";
import { Button } from "@/components/ui/button";
import parse from 'html-react-parser';


async function page({params}){
    const question = await getQuestion(params.id);
    const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
    return (
        <div className="flex flex-col md:flex-row mt-[3em] gap-[3em] w-full h-full">
            <div className="flex flex-col">
            <div className="flex items-center gap-4">
                    <h1 className="text-sm uppercase text-red font-normal">{question.examYear}</h1>
                    <h1 className="text-sm uppercase text-red font-normal">{question.subject?.name}</h1>
                    <h1 className="text-sm uppercase text-red font-normal">{question.examType}</h1>
                </div>
                 <h1 className="text-2xl font-semibold ">{parse(`${question.question}`)}</h1>
                <div className="flex flex-col gap-[2em]">
                <div className='flex flex-col  gap-2 mt-3 border  p-3 rounded'>
                    {question.options.map((option, index) => (
                            <div 
                            key={index}
                            className='flex gap-2'>
                            <h1 className='font-bold'>{optionLabels[index]}. </h1><h1 className="raleway capitalize" key={index}>{parse(`${option}`)}</h1>
                            </div>
                    ))}
                </div>
                <div className='flex flex-col gap-2 mt-5'>
                    <h1 className="text-xl font-semibold">Correct Answer: <span className="underline">{parse(`${question.answer}`)}</span></h1>
                     <div className="flex flex-col  gap-5">
                        <div className="flex flex-col">
                        <h1 className="text-xl font-semibold">
                        Explanation
                        </h1>
                        {question.answerDetail ? (
                         <h1 className="underline font-raleway">{parse(`${question.answerDetail}`)}</h1>
                        ): (<span className="text-red-400">This Question has no answer detail yet, Add one </span>)} 
                        {parse(`${question.answerDetail}`)}

                        </div>
                    
                    
                    <div className="hidden items-center flex-wrap gap-5">
                        <Button
                         title='Report an Error' />
                         <Button
                         title='Find Roomate' />
                         <Button
                         title='Ask A Question' />
                         <Button
                         title='Sell Your Stuffs' />
                            
                    </div>
                    
                    </div> 
                </div>
                </div>
            </div>
            <div className="flex flex-col md:min-w-[300px] gap-[2em] h-full">
                <LatestArticles />
        </div>
        </div>
    )
}

export default page;