"use client";

import { useEffect } from "react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.kidscantech.App";
const APP_STORE_URL =
  "https://apps.apple.com/us/app/90percent/id6747773294";

export default function DownloadPage() {
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || "";

    if (/iPad|iPhone|iPod/.test(ua)) {
      window.location.href = APP_STORE_URL;
    } else {
      window.location.href = PLAY_STORE_URL;
    }
  }, []);

  return null;
}
