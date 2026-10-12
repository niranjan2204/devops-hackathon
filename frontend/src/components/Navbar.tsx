"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, FileCode2, User, Mail, Shield, TerminalSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { href: "/problems", label: "Problems", icon: <FileCode2 className="w-5 h-5" /> },
    { href: "/contact", label: "Contact", icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel">
      <div className="w-full px-3 sm:px-6 lg:px-12">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          
          {/* LEFT: LOGO */}
          <div className="flex items-center min-w-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_#00f3ff] transition-all flex-shrink-0">
              <div className="flex flex-col items-center border-r border-[#1a237e] pr-2 sm:pr-3">
                <img src="https://www.bitsathy.ac.in/wp-content/uploads/cropped-bit_logo.png" alt="BIT Logo" className="h-7 sm:h-10 w-auto object-contain" />
                <span className="text-[#1a237e] text-[6px] sm:text-[8px] font-serif tracking-tight mt-0.5">Stay Ahead</span>
              </div>
              <div className="flex flex-col justify-center text-[#1a237e] tracking-tight">
                <span className="font-serif font-semibold text-xs sm:text-lg leading-tight uppercase">Bannari Amman</span>
                <span className="font-sans font-medium text-[8px] sm:text-[11px] leading-tight uppercase">Institute of Technology</span>
              </div>
            </Link>
            
            <div className="ml-3 sm:ml-5 pl-3 sm:pl-5 border-l border-white/20 hidden md:flex flex-col justify-center">
              <span className="font-black text-lg sm:text-xl tracking-tighter flex items-center gap-1">
                <span className="text-white">DEVSPRINT</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#ff00ea]">2026</span>
              </span>
            </div>
          </div>
          
          {/* RIGHT: DESKTOP NAV */}
          <div className="hidden lg:flex items-center justify-end space-x-6 xl:space-x-8">
            <Link href="/" className={`text-sm font-bold tracking-widest uppercase transition-colors ${pathname === "/" ? "text-[#00f3ff]" : "text-gray-300 hover:text-white"}`}>
              HOME
            </Link>
            <Link href="/problems" className={`text-sm font-bold tracking-widest uppercase transition-colors ${pathname === "/problems" ? "text-[#00f3ff]" : "text-gray-300 hover:text-white"}`}>
              PROBLEMS
            </Link>
            <Link href="/contact" className={`text-sm font-bold tracking-widest uppercase transition-colors ${pathname === "/contact" ? "text-[#00f3ff]" : "text-gray-300 hover:text-white"}`}>
              CONTACT
            </Link>
            
            <Link href="/login" className={`text-sm font-bold tracking-widest uppercase transition-colors ${pathname === "/login" ? "text-[#00f3ff]" : "text-gray-300 hover:text-white"}`}>
              Login
            </Link>
            <Link href="/register" className="btn-animated-border text-white px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center hover:scale-105 transition-transform tracking-widest">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">REGISTER TEAM</span>
            </Link>
          </div>

          {/* RIGHT: MOBILE NAV CONTROLS */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3">
            <Link 
              href="/register" 
              className="bg-[#00f3ff] text-black text-[11px] sm:text-xs font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg tracking-wider hover:bg-white transition-all whitespace-nowrap shadow-[0_0_10px_rgba(0,243,255,0.3)]"
            >
              REGISTER
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-black/50 border border-gray-800 text-gray-200 hover:text-white hover:border-[#00f3ff]/50 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5 text-[#ff00ea]" /> : <Menu className="w-5 h-5 text-[#00f3ff]" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-gray-800 bg-[#030014]/95 backdrop-blur-2xl overflow-hidden shadow-2xl"
          >
            <div className="px-4 py-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
              
              {/* Event Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-800/80">
                <span className="text-xs font-mono font-bold tracking-widest text-[#00f3ff]">DEVSPRINT 2026</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Navigation</span>
              </div>

              {/* Main Links */}
              <div className="space-y-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wider transition-all ${
                      pathname === item.href
                        ? "bg-[#00f3ff]/10 text-[#00f3ff] border border-[#00f3ff]/30 shadow-[0_0_15px_rgba(0,243,255,0.15)]"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Action Links */}
              <div className="pt-2 border-t border-gray-800/80 space-y-2">
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#00f3ff] to-[#ff00ea] text-black font-black py-3 px-4 rounded-xl text-sm tracking-widest shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:opacity-90 transition-opacity"
                >
                  <TerminalSquare className="w-4 h-4 text-black" />
                  <span>REGISTER TEAM</span>
                </Link>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-800 bg-black/40 text-gray-200 hover:text-white hover:border-[#00f3ff]/40 text-xs font-bold tracking-wider transition-colors"
                  >
                    <User className="w-4 h-4 text-[#00f3ff]" />
                    <span>Team Login</span>
                  </Link>
                  <Link
                    href="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-800 bg-black/40 text-gray-200 hover:text-white hover:border-[#ff00ea]/40 text-xs font-bold tracking-wider transition-colors"
                  >
                    <Shield className="w-4 h-4 text-[#ff00ea]" />
                    <span>Admin</span>
                  </Link>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
