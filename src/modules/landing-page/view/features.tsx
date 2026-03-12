import FeaturesPart1 from "../ui/features-part1";
// import FeaturesPart2 from "../ui/features-part2";
// import FeaturesPart3 from "../ui/features-part3";

export default function Features() {
  return (
    <section id="features" className="bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-screen-xl flex flex-col gap-[51px]">
        {/* Heading */}
        <h2 className="text-center text-3xl  font-semibold tracking-tight text-app-secondary md:text-4xl">
          One App That Makes{" "}
          <span className="text-app-primary">JAMB and Post-UTME</span>  Easy
        </h2>


        {/* Part 1 */}
        <FeaturesPart1 />
        {/* Part 2  */}
        {/* <FeaturesPart2 /> */}


     
      </div>
    </section>
  );
}
