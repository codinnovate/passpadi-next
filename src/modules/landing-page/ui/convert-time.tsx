import Image from "next/image";
import convertTime from "../assets/convert-time.svg";
import dots from "../assets/dots.png";

export default function ConvertTime() {
  return (
    <div
      className="h-[597px] md:h-[761px] flex flex-col justify-between bg-[#F3F9FF] items-center rounded-[24px]  pt-9"
      style={{
        backgroundImage: `url(${(dots as unknown as { src: string }).src})`,
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
      }}
    >
      <h3 className="text-3xl md:text-[59px] font-medium mt-[94px] px-5 text-center tracking-tight text-app-secondary md:text-3xl"> Convert Study  Time Into <span className="text-app-primary">Streaks</span></h3>
      <Image src={convertTime} alt="Convert Time into Practice" 
      width={800} height={342} className="mt-4 w-full h-[342px]" priority />
    </div>  
  );
}
