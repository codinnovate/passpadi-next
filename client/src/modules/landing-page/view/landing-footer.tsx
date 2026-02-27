import Logo from "@/components/Logo";

export default function LandingFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white px-4 py-6">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <span>&copy;</span>
          <Logo className="w-[70px]" />
          <span>&apos;{new Date().getFullYear().toString().slice(-2)}</span>
        </div>
      </div>
    </footer>
  );
}
