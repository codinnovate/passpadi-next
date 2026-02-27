export default function SubjectPractice() {
  return (
    <section className="bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-screen-xl">
        {/* Heading */}
        <h2 className="text-center text-3xl font-bold tracking-tight text-app-secondary md:text-4xl">
          Choose a <span className="text-app-primary">JAMB Subject</span>
          <br />
          and <span className="text-app-primary">Practice Smarter</span>
        </h2>

        {/* Card 1 — Solve JAMB */}
        <div className="mt-12 overflow-hidden rounded-3xl bg-app-primary p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold leading-snug text-white md:text-4xl">
                Solve JAMB
                <br />
                Questions.
                <br />
                Understand
                <br />
                Better.
              </h3>
            </div>
            {/* Screenshot placeholder */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-[260px] w-[150px] rounded-2xl bg-white/20 shadow-lg">
                <div className="flex h-full items-center justify-center text-white/60">
                  <span className="text-xs">AI Explanation</span>
                </div>
              </div>
              <div className="h-[220px] w-[150px] rounded-2xl bg-white/20 shadow-lg">
                <div className="flex h-full flex-col items-center justify-center gap-2 text-white/60">
                  <span className="text-xs">Question 1/20</span>
                  <span className="text-3xl">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 — Practice Post-UTME */}
        <div className="mt-6 overflow-hidden rounded-3xl bg-app-primary p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            {/* Screenshot placeholder */}
            <div className="order-2 flex items-center justify-center gap-4 md:order-1">
              <div className="h-[260px] w-[150px] rounded-2xl bg-white/20 shadow-lg">
                <div className="flex h-full flex-col items-center justify-center gap-3 text-white/60">
                  <span className="text-xs">Exam Settings</span>
                  <div className="flex gap-2">
                    <span className="rounded-lg bg-white/20 px-3 py-1 text-[10px]">Post-UTME</span>
                    <span className="rounded-lg bg-white/20 px-3 py-1 text-[10px]">JAMB</span>
                  </div>
                </div>
              </div>
              <div className="h-[220px] w-[150px] rounded-2xl bg-white/20 shadow-lg">
                <div className="flex h-full items-center justify-center text-white/60">
                  <span className="text-xs">AI Explanation</span>
                </div>
              </div>
            </div>
            <div className="order-1 text-right md:order-2">
              <h3 className="text-3xl font-bold leading-snug text-white md:text-4xl">
                Practice
                <br />
                Post-UTME
                <br />
                Like the Real
                <br />
                Exam
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
