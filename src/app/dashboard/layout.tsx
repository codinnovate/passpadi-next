import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Header — full width, sticks to top */}
      <Header />

      {/* Body: sidebar + main content */}
      <div className="mx-auto flex w-full max-w-screen-2xl">
        {/* Desktop sidebar — hidden on mobile */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 min-w-0 px-4 py-4 pb-20 md:pb-4">
          {children}
        </main>
      </div>

      {/* Footer — hidden on mobile (bottom nav takes its place) */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile bottom tab bar + sheet drawer — hidden on desktop */}
      <BottomNav />
    </>
  );
}
