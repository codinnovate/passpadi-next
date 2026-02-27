import Link from "next/link";
import Image from "next/image";
import appStoreBadge from "../assets/app-store.svg";
import googlePlayBadge from "../assets/google-play.svg";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/90percent/id6747773294";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.kidscantech.App";

export default function AppStoreButtons() {
  return (
    <div className="flex  items-center gap-3">
      <Link
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download on the App Store"
      >
        <Image src={appStoreBadge} alt="Download on the App Store" height={44} width={147} />
      </Link>
      <Link
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get it on Google Play"
      >
        <Image src={googlePlayBadge} alt="Get it on Google Play" height={44} width={147} />
      </Link>
    </div>
  );
}
