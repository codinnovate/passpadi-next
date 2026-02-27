import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-7xl font-bold text-app-primary">404</h1>
      <p className="max-w-md text-lg text-app-secondary/70">
        We couldn&apos;t find the page you&apos;re looking for. It may have been moved or
        doesn&apos;t exist.
      </p>
      <Button
        asChild
        className="mt-2 rounded-xl bg-app-primary text-white hover:bg-app-primary/90"
      >
        <Link href="/">
          <Home size={16} />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
