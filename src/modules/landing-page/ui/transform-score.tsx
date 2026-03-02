import dots from "../assets/dots.png";
import Image from "next/image";
import rankings from "../assets/rankings.svg";



export default function TransformScore() {
  return (
    <div 
    className="flex flex-col justify-center items-center rounded-[24px] gap-3 h-[360px] bg-[#C1FAE9]"
     style={{
        backgroundImage: `url(${(dots as unknown as { src: string }).src})`,
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
      }}
    >
      <h3 className="text-2xl w-[337px] text-center font-medium  text-app-secondary md:text-3xl">
      Transform Your <span className="text-app-primary">Score</span> into <span className="text-app-primary">Rankings</span>
      </h3>
       <Image src={rankings}
        alt="Transform Score into Rankings"
       width={400} height={147}
    
        className="mt-4 w-[318px] h-[147px]" 
        priority />
    </div>
  );
}