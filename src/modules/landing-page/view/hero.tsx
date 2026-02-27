import Image from "next/image";
import AppStoreButtons from "../ui/appstores";
import dotsBg from "../assets/dots.png";
import iphoneFull from "../assets/iphone-full.svg";
import iphoneHalf from "../assets/iphone-half.svg";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-white"
      style={{
        backgroundImage: `url(${dotsBg.src})`,
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      }}
    >
      <div className="mx-auto grid max-w-screen-xl items-center justify-center gap-10 px-4 pt-16 md:grid-cols-2 md:pt-24">
        {/* Left */}
        <div className="max-w-[300px] md:max-w-xl flex  flex-col  items-center md:items-start">
          <h1 className="text-3xl  text-center  md:text-start  md:text-5xl lg:text-[56px] font-semibold leading-[1.15] tracking-tight text-app-secondary">
            Ace Your{" "}
            <span className="text-app-primary">Post-UTME &amp; JAMB</span>{" "}
            with Smart CBT Practice
          </h1>
          <p className="mt-5 text-center   text-regular md:text-start text-base leading-relaxed text-gray-500 md:text-lg">
            Prepare confidently, learn faster, and excel in your exams with
            up-to-date questions and practice tools.
          </p>
          <div className="mt-8">
            <AppStoreButtons />
          </div>
        </div>

        {/* Right — Phone mockup */}
        <div className="flex items-center justify-center">
          <Image
            src={iphoneFull}
            alt="90percent app preview"
            className="hidden md:block"
            priority
          />
          <Image
            src={iphoneHalf}
            alt="90percent app preview"
            className="block md:hidden"
            priority
          />
        </div>

        
      </div>
    </section>
  );
}
