import dots from "../assets/dots.png";
import Image from "next/image";
import smartsubjects from "../assets/smart-subjects.svg";



export default function TurnSubjects() {
  return (
    <div 
    className="flex flex-col justify-center items-center rounded-[24px] gap-3 h-[360px] bg-[#FFEEF4]"
     style={{
        backgroundImage: `url(${(dots as unknown as { src: string }).src})`,
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
      }}
    >
      <h3 className="text-2xl w-[337px] text-center font-medium  text-app-secondary md:text-3xl">
      Turn <span className="text-app-primary">Subjects</span> into <span className="text-app-primary">Smart Practice</span>
      </h3>
       <Image src={smartsubjects}
        alt="Turn Subjects into Smart Practice"
       width={400} height={172}
    
        className="mt-4 w-[357px] h-[172px]" 
        priority />
    </div>
  );
}