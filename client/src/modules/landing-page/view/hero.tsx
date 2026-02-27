import AppStoreButtons from "../ui/appstores";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-screen-xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        {/* Left */}
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-app-secondary md:text-5xl lg:text-[56px]">
            Ace Your{" "}
            <span className="text-app-primary">Post-UTME</span>
            {" "}
            &amp; <span className="text-app-primary">JAMB</span>{" "}
            with Smart CBT Practice
          </h1>
          <p className="mt-5 text-base leading-relaxed text-gray-500 md:text-lg">
            Prepare confidently, learn faster, and excel in your exams with
            up-to-date questions and practice tools.
          </p>
          <div className="mt-8">
            <AppStoreButtons />
          </div>
        </div>

        {/* Right — Phone mockup placeholder */}
        <div className="flex items-center justify-center">
          <div className="relative h-[500px] w-[280px] rounded-[40px] border-4 border-gray-200 bg-gray-50 shadow-2xl md:h-[560px] md:w-[300px]">
            <div className="absolute inset-x-0 top-0 mx-auto h-6 w-28 rounded-b-2xl bg-gray-200" />
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <div className="text-3xl">📱</div>
              <p className="mt-3 text-xs text-gray-400">
                App screenshot
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
