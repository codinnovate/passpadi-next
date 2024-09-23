import React from "react";
import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";
import Script from "next/script";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
  title: "PassPadi",
  description: "Passpadi: A Friend that helps you improve",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang='en'>
      <Script 
      id="google-adsense-script"
      async 
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8689849165840696"
     crossOrigin="anonymous">
     </Script>
    <Script
        id="katex"
        defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js" integrity="sha384-7zkQWkzuo3B5mTepMUcHkMB5jZaolc2xDwL6VFqjFALcbeS9Ggm/Yr2r3Dy4lfFg" crossOrigin="anonymous"></Script>
    <Script 
    id="katex-renderer"
    defer 
    src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js" 
    integrity="sha384-43gviWU0YVjaDtb/GhzOouOXtZMP/7XUzwPTstBeZFe/+rCMvRwr4yROQP43s0Xk" 
    crossOrigin="anonymous">
      
    </Script>
        <body className=''>
          <div className="max-w-6xl mx-auto p-2">
         <Header />
          </div>
          <main className='max-w-6xl mx-auto flex flex-row p-2'>
              {children}
          </main>
          <Footer />
        </body>
      </html>
  );
}
