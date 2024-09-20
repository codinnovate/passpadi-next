import BestWeek from "@/components/BestWeek";
import LatestArticles from "@/components/LatestArticles";
import JustFor from '@/components/JustFor';

export default function Home() {

  return (
    <div className="flex flex-col  w-full h-full gap-[3em] p-4">
      <div className="w-full  flex flex-col md:flex-row  h-full  gap-[3em]">
      <BestWeek />
      <LatestArticles />
      </div>
      <JustFor />

    </div>
  );
}
