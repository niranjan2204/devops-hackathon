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

export const metadata: Metadata = {
  title: "DevSprint 2026 | Bannari Amman Institute of Technology",
  description: "DevSprint 2026 - A competitive DevOps-focused hackathon where teams solve real-world technology challenges.",
};

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-panel">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between h-20 items-center">
          
          {/* LEFT: LOGO */}
          <div className="flex items-center flex-1">
            <Link href="/" className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_#00f3ff] transition-all">
              <div className="flex flex-col items-center border-r border-[#1a237e] pr-3">
                <img src="https://www.bitsathy.ac.in/wp-content/uploads/cropped-bit_logo.png" alt="BIT Logo" className="h-10 w-auto object-contain" />
                <span className="text-[#1a237e] text-[8px] font-serif tracking-tight mt-1">Stay Ahead</span>
              </div>
              <div className="flex flex-col justify-center text-[#1a237e] tracking-tight">
                <span className="font-serif font-semibold text-lg leading-tight uppercase">Bannari Amman</span>
                <span className="font-sans font-medium text-[11px] leading-tight uppercase">Institute of Technology</span>
              </div>
            </Link>
            <div className="ml-5 pl-5 border-l border-white/20 hidden xl:flex flex-col justify-center">
              <span className="font-black text-xl tracking-tighter flex items-center gap-1">
                <span className="text-white">DEVSPRINT</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#ff00ea]">2026</span>
              </span>
            </div>
          </div>
          
          {/* RIGHT: NAV & LOGIN / REGISTER */}
          <div className="flex items-center justify-end flex-1 space-x-6 lg:space-x-8">
            <Link href="/" className="hidden lg:block text-gray-300 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase">HOME</Link>
            <Link href="/contact" className="hidden lg:block text-gray-300 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase">CONTACT</Link>
            
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase">
              Login
            </Link>
            <Link href="/register" className="btn-animated-border text-white px-6 py-2.5 text-sm font-bold flex items-center justify-center hover:scale-105 transition-transform tracking-widest">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">REGISTER TEAM</span>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="glass-panel mt-auto py-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/register" className="hover:text-white">Register</Link>
          <Link href="/login" className="hover:text-white">Login</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
        <p className="font-bold text-gray-300">Bannari Amman Institute of Technology</p>
        <p className="mt-2 text-gray-500">© 2026 DevSprint. All rights reserved.</p>
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
        <div className="orb-1"></div>
        <div className="orb-2"></div>
        <div className="orb-3"></div>
        <div className="space-grid"></div>
        
        <Navbar />
        <main className="flex-grow pt-20 z-10 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
