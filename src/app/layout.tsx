import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketplace — Buy and sell locally",
  description: "Discover great finds and sell items in your community.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SiteHeader />
        {children}
        <footer className="mt-20 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-slate-500">
            Marketplace · Buy and sell in your community
          </div>
        </footer>
      </body>
    </html>
  );
}
