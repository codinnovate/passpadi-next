import AppStoreButtons from "../ui/appstores";

export default function DownloadCTA() {
  return (
    <section className="bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-screen-xl overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-white">
        <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
          {/* Left */}
          <div>
            <h2 className="text-3xl font-bold leading-snug text-app-secondary md:text-4xl lg:text-5xl">
              Exams no be luck.
              <br />
              Download 90Percent.
            </h2>
            <div className="mt-8">
              <AppStoreButtons />
            </div>
          </div>

          {/* Right — Phone mockup placeholder */}
          <div className="flex items-center justify-center">
            <div className="relative h-[360px] w-[200px] rounded-[32px] border-2 border-gray-200 bg-white shadow-xl">
              <div className="absolute inset-x-0 top-0 mx-auto h-5 w-20 rounded-b-xl bg-gray-200" />
              <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                <div className="text-3xl">📱</div>
                <p className="mt-2 text-xs text-gray-400">App screenshot</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
