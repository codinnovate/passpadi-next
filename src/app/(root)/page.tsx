import BestWeek from "@/components/BestWeek";
import LatestArticles from "@/components/LatestArticles";
import PastQuestions from '@/components/PastQuestions';
import JustFor from '@/components/JustFor';

export default function Home() {

  return (
    <div className="flex flex-col  w-full h-full gap-[3em] p-4">
      <div className="w-full  flex flex-col md:flex-row  h-full  gap-[3em]">
      <BestWeek />
      <LatestArticles />
      </div>
      <PastQuestions />
      {/* <Asks /> */}
      {/* <div className='flex flex-col mt-[2em] gap-[1em] '>
        {preps.map((exam, idx) => (
            <ExamPreps
            key={idx} 
            exam={exam}
            />
        ))}
      </div> */}
      <JustFor />

    </div>
  );
}
