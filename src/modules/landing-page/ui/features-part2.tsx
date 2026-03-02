import Practice from "./practice";
import SolveJamb from "./solve-jamb";

export default function FeaturesPart2() {
  return (
    <div className="flex flex-col">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-app-secondary md:text-4xl">
          Choose a JAMB Subject and Practice Smarter
        </h2>
    
     <SolveJamb />
     <Practice />
    </div>
  );
}
