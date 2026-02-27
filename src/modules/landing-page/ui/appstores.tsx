import Link from "next/link";

export default function AppStoreButtons() {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="#"
        aria-label="Download on the App Store"
        className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50"
      >
        <span className="mr-2 text-xl"></span>
        <span>
          <span className="block text-[10px] leading-3 text-gray-500">
            Download on the
          </span>
          <span className="block leading-4">App Store</span>
        </span>
      </Link>
      <Link
        href="#"
        aria-label="Get it on Google Play"
        className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50"
      >
        <span className="mr-2 text-base">▶︎</span>
        <span>
          <span className="block text-[10px] leading-3 text-gray-500">
            GET IT ON
          </span>
          <span className="block leading-4">Google Play</span>
        </span>
      </Link>
    </div>
  );
}
