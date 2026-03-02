import ConvertTime from "./convert-time";
import TransformScore from "./transform-score";
import TurnSubjects from "./turn-subjects";

export default function FeaturesPart1() {
  return (
    <div className="flex flex-col md:flex-row w-full gap-[51px] md:gap-[41px]">
      <ConvertTime />
      <div className='flex flex-col  min-w-1/2  md:h-[761px] justify-between'>
        <TransformScore />
        <TurnSubjects />
      </div>
    </div>
  );
}
