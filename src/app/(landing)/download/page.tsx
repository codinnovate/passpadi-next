"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "iconsax-reactjs";

// TODO: Replace with your actual store URLs
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.ninety_percent";
const APP_STORE_URL =
  "https://apps.apple.com/app/90percent/id000000000";

function getDevicePlatform(): "android" | "ios" | "unknown" {
  if (typeof navigator === "undefined") return "unknown";

  const ua = navigator.userAgent || navigator.vendor || "";

  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";

  return "unknown";
}

export default function DownloadPage() {
  useEffect(() => {
    const platform = getDevicePlatform();

    if (platform === "android") {
      window.location.href = PLAY_STORE_URL;
    } else if (platform === "ios") {
      window.location.href = APP_STORE_URL;
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-app-secondary md:text-4xl">
        Download 90percent
      </h1>
      <p className="mt-3 max-w-md text-gray-500">
        Redirecting you to the store... If nothing happens, pick your platform below.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <a
          href={PLAY_STORE_URL}
          className="group inline-flex items-center gap-2 rounded-xl bg-app-secondary px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-[0.97]"
        >
          Google Play
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </a>
        <a
          href={APP_STORE_URL}
          className="group inline-flex items-center gap-2 rounded-xl bg-app-secondary px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-[0.97]"
        >
          App Store
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </a>
      </div>

      <Link
        href="/"
        className="mt-8 text-sm text-gray-400 transition-colors hover:text-app-primary"
      >
        Back to home
      </Link>
    </div>
  );
}
