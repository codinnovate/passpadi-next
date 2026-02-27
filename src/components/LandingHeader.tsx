"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { HamburgerMenu, CloseSquare } from "iconsax-reactjs";

const navLinks = [
  { label: "Company", href: "#features" },
  { label: "Features", href: "#features" },
  { label: "FAQs", href: "#reviews" },
];

const LandingHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between gap-4 px-4">
        {/* Logo */}
        <div className="shrink-0">
          <Logo className="w-[90px]" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-gray-600 transition-colors hover:text-app-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link
            href="/download"
            className="hidden rounded-full bg-app-secondary px-5 py-2 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-[0.97] sm:inline-flex"
          >
            Download Now
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <CloseSquare size={22} /> : <HamburgerMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="border-t border-gray-100 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-gray-600 transition-colors hover:text-app-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/download"
              onClick={() => setMobileOpen(false)}
              className="mt-1 inline-flex w-fit rounded-full bg-app-secondary px-5 py-2 text-sm font-medium text-white"
            >
              Download Now
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default LandingHeader;
