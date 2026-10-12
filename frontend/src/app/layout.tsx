import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import React from "react";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "DevSprint 2026 | Bannari Amman Institute of Technology",
  description: "DevSprint 2026 - A competitive DevOps-focused hackathon where teams solve real-world technology challenges.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

function Footer() {
  return (
    <footer className="glass-panel mt-auto py-6 sm:py-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-xs sm:text-sm">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/problems" className="hover:text-white transition-colors">Problems</Link>
          <Link href="/register" className="hover:text-white transition-colors">Register</Link>
          <Link href="/login" className="hover:text-white transition-colors">Login</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
        <p className="font-bold text-gray-300">Bannari Amman Institute of Technology</p>
        <p className="mt-1 sm:mt-2 text-gray-500 text-[11px] sm:text-xs">© 2026 DevSprint. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col relative overflow-x-hidden bg-[#030014]">
        {/* Animated Background Elements */}
        <div className="orb-1 pointer-events-none"></div>
        <div className="orb-2 pointer-events-none"></div>
        <div className="orb-3 pointer-events-none"></div>
        <div className="space-grid pointer-events-none"></div>
        
        <Navbar />
        <main className="flex-grow pt-16 sm:pt-20 z-10 flex flex-col w-full overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
