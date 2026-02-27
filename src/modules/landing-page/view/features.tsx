export default function Features() {
  return (
    <section id="features" className="bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-screen-xl">
        {/* Heading */}
        <h2 className="text-center text-3xl font-bold tracking-tight text-app-secondary md:text-4xl">
          One App That Makes{" "}
          <span className="text-app-primary">JAMB</span>
          <br className="hidden sm:block" />
          {" "}and <span className="text-app-primary">Post-UTME</span> Easy
        </h2>

        {/* Bento grid */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 — Streaks (tall, spans 2 rows) */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-app-primary/10 p-8 md:row-span-2">
            <div>
              <h3 className="text-2xl font-bold leading-snug text-app-secondary">
                Convert Study Time
                <br />
                Into <span className="text-app-primary">Streaks</span>
              </h3>
            </div>
            <div className="mt-8 flex items-end justify-center">
              <div className="h-[280px] w-[160px] rounded-[24px] border-2 border-white/40 bg-white/50 shadow-lg">
                <div className="flex h-full items-center justify-center">
                  <span className="text-4xl">🔥</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 — Rankings */}
          <div className="flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-emerald-50 p-8 text-center lg:col-span-2">
            <h3 className="text-xl font-bold text-app-secondary">
              Transform <span className="text-app-primary">Scores</span>
              {" "}into <span className="text-app-primary">Rankings</span>
            </h3>
            <div className="mt-6 flex items-end gap-3">
              <div className="flex size-14 items-center justify-center rounded-full bg-gray-200 text-lg ring-2 ring-white">
                🥈
              </div>
              <div className="flex size-16 items-center justify-center rounded-full bg-app-primary/20 text-xl ring-4 ring-app-primary/30">
                🥇
              </div>
              <div className="flex size-14 items-center justify-center rounded-full bg-gray-200 text-lg ring-2 ring-white">
                🥉
              </div>
            </div>
          </div>

          {/* Card 3 — Subjects */}
          <div className="flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-emerald-50 p-8 text-center lg:col-span-2">
            <h3 className="text-xl font-bold text-app-secondary">
              Turn <span className="text-app-primary">Subjects</span>
              {" "}Into <span className="text-app-primary">Smart Practice</span>
            </h3>
            <div className="mt-6 grid grid-cols-4 gap-3">
              {["Physics", "Math", "Chemistry", "Civic", "Commerce", "Biology", "English", "CBT"].map((s) => (
                <div
                  key={s}
                  className="flex size-12 items-center justify-center rounded-xl bg-white text-xs font-medium text-gray-600 shadow-sm"
                >
                  {s.slice(0, 3)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
