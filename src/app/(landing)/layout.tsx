import React from "react";
import { GeistSans } from "geist/font/sans";
import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/modules/landing-page/view/landing-footer";
import Footer from "@/components/Footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${GeistSans.className} landing-geist`}>
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <Footer />
      <LandingFooter />
    </div>
  );
}
