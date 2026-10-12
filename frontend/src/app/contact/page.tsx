"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";

export default function ContactPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/config`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setConfig(data);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full flex-1 flex flex-col pt-32 pb-20 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#ff00ea]/20 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#00f3ff]/20 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 w-full relative z-10">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-widest text-white"
          >
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#ff00ea]">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 font-mono text-sm max-w-xl mx-auto"
          >
            Have questions about DevSprint 2026? Our team is here to help you out.
          </motion.p>
        </div>

        {loading ? (
          <div className="text-center text-[#00f3ff] font-mono animate-pulse">Loading Contact Details...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Faculty Coordinator */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-8 rounded-2xl border border-[#ff00ea]/30 text-center flex flex-col items-center hover:scale-105 transition-transform bg-black/40"
              >
                <div className="w-16 h-16 bg-[#ff00ea]/10 rounded-full flex items-center justify-center mb-6 border border-[#ff00ea]/30 shadow-[0_0_15px_rgba(255,0,234,0.2)]">
                  <Mail className="w-8 h-8 text-[#ff00ea]" />
                </div>
                <span className="text-[#ff00ea] text-[10px] font-black uppercase tracking-widest mb-2 border border-[#ff00ea]/30 px-2 py-0.5 rounded-full bg-[#ff00ea]/10">Faculty Coordinator</span>
                <h3 className="text-white font-bold mb-4 uppercase tracking-wide text-lg">{config?.facultyName || "Dr. Smith"}</h3>
                <div className="space-y-2 text-sm">
                  <a href={`mailto:${config?.facultyEmail || ""}`} className="flex items-center justify-center gap-2 text-gray-300 hover:text-[#00f3ff] transition-colors"><Mail className="w-4 h-4" /> {config?.facultyEmail || "faculty@bitsathy.ac.in"}</a>
                  <a href={`tel:${config?.facultyPhone || ""}`} className="flex items-center justify-center gap-2 text-gray-300 hover:text-[#00f3ff] transition-colors"><Phone className="w-4 h-4" /> {config?.facultyPhone || "+91 98765 43210"}</a>
                </div>
              </motion.div>

              {/* Organizer 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-panel p-8 rounded-2xl border border-[#00f3ff]/30 text-center flex flex-col items-center hover:scale-105 transition-transform bg-black/40"
              >
                <div className="w-16 h-16 bg-[#00f3ff]/10 rounded-full flex items-center justify-center mb-6 border border-[#00f3ff]/30 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                  <Phone className="w-8 h-8 text-[#00f3ff]" />
                </div>
                <span className="text-[#00f3ff] text-[10px] font-black uppercase tracking-widest mb-2 border border-[#00f3ff]/30 px-2 py-0.5 rounded-full bg-[#00f3ff]/10">Student Organizer</span>
                <h3 className="text-white font-bold mb-4 uppercase tracking-wide text-lg">{config?.org1Name || "John Doe"}</h3>
                <div className="space-y-2 text-sm">
                  <a href={`mailto:${config?.org1Email || ""}`} className="flex items-center justify-center gap-2 text-gray-300 hover:text-[#ff00ea] transition-colors"><Mail className="w-4 h-4" /> {config?.org1Email || "org1@bitsathy.ac.in"}</a>
                  <a href={`tel:${config?.org1Phone || ""}`} className="flex items-center justify-center gap-2 text-gray-300 hover:text-[#ff00ea] transition-colors"><Phone className="w-4 h-4" /> {config?.org1Phone || "+91 98765 43211"}</a>
                </div>
              </motion.div>

              {/* Organizer 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-panel p-8 rounded-2xl border border-[#00f3ff]/30 text-center flex flex-col items-center hover:scale-105 transition-transform bg-black/40"
              >
                <div className="w-16 h-16 bg-[#00f3ff]/10 rounded-full flex items-center justify-center mb-6 border border-[#00f3ff]/30 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                  <Phone className="w-8 h-8 text-[#00f3ff]" />
                </div>
                <span className="text-[#00f3ff] text-[10px] font-black uppercase tracking-widest mb-2 border border-[#00f3ff]/30 px-2 py-0.5 rounded-full bg-[#00f3ff]/10">Student Organizer</span>
                <h3 className="text-white font-bold mb-4 uppercase tracking-wide text-lg">{config?.org2Name || "Jane Doe"}</h3>
                <div className="space-y-2 text-sm">
                  <a href={`mailto:${config?.org2Email || ""}`} className="flex items-center justify-center gap-2 text-gray-300 hover:text-[#ff00ea] transition-colors"><Mail className="w-4 h-4" /> {config?.org2Email || "org2@bitsathy.ac.in"}</a>
                  <a href={`tel:${config?.org2Phone || ""}`} className="flex items-center justify-center gap-2 text-gray-300 hover:text-[#ff00ea] transition-colors"><Phone className="w-4 h-4" /> {config?.org2Phone || "+91 98765 43212"}</a>
                </div>
              </motion.div>

            </div>

            <div className="mt-12 glass-panel p-6 rounded-2xl border border-yellow-400/30 text-center max-w-2xl mx-auto flex flex-col items-center bg-black/40">
              <MapPin className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-white font-bold mb-2 uppercase tracking-wide">Event Location</h3>
              <p className="text-gray-300 text-sm">
                {config?.contactAddress || "Bannari Amman Institute of Technology, Sathyamangalam, Erode, Tamil Nadu 638401"}
              </p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
