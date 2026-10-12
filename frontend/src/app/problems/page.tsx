"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, FileCode2, AlertCircle, CheckCircle2, Shield, LockOpen, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export default function ProblemsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const fetchProblems = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/problems`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
    // Lightweight polling every 3 seconds for realtime updates
    const interval = setInterval(fetchProblems, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = async (problemId: string) => {
    setError("");
    setSuccessMsg("");
    setSelecting(problemId);

    try {
      const res = await fetch(`${API_BASE_URL}/api/problems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ problemId })
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to select problem");
      }

      setSuccessMsg("Problem statement successfully locked to your team!");
      fetchProblems(); // Immediate refresh
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSelecting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#00f3ff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (data?.locked) {
    // Problem statements are locked before hackathon start
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-10 rounded-2xl max-w-xl w-full text-center border-gray-800"
        >
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 uppercase">PROBLEM STATEMENTS LOCKED</h1>
          <p className="text-gray-400 mb-8">Problem statements will be revealed when DevSprint 2026 begins.</p>
          
          <div className="bg-black/50 p-6 rounded-xl border border-gray-800">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">STARTING IN</p>
            {/* Simple static display for now; real countdown logic goes here if needed */}
            <p className="text-2xl font-mono text-[#00f3ff] neon-text-blue tracking-wider">
              WAITING FOR LAUNCH
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 relative z-10">
      <div className="mb-4 flex">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-black/30 px-4 py-2 rounded-lg border border-gray-800 hover:border-[#00f3ff]/50 hover:shadow-[0_0_10px_rgba(0,243,255,0.2)] backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold tracking-wider uppercase">Back</span>
        </button>
      </div>

      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold uppercase mb-4"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">CHOOSE YOUR</span> <br className="md:hidden"/>
          <span className="text-[#00f3ff] neon-text-blue">PROBLEM STATEMENT</span>
        </motion.h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Each team can select ONLY ONE problem statement. Make your choice carefully.</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-3xl mx-auto bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-8 flex items-start gap-3 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold">PROBLEM STATEMENT ALREADY SELECTED</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </motion.div>
        )}
        
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-3xl mx-auto bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg mb-8 flex items-center gap-3 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
          >
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <p className="font-bold">{successMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.problems.map((problem: any, index: number) => (
          <motion.div 
            key={problem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-panel rounded-2xl overflow-hidden flex flex-col border ${problem.status === 'SELECTED' ? 'border-gray-800 opacity-60' : 'border-[#00f3ff]/30 hover:border-[#00f3ff] hover:shadow-[0_0_20px_rgba(0,243,255,0.15)]'} transition-all`}
          >
            <div className={`p-6 border-b ${problem.status === 'SELECTED' ? 'border-gray-800 bg-gray-900/50' : 'border-[#00f3ff]/20 bg-[#00f3ff]/5'}`}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-black border border-gray-700 text-gray-300">
                  {problem.domain}
                </span>
                {problem.status === 'SELECTED' ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-gray-500 px-3 py-1 bg-black rounded-full border border-gray-800">
                    <Lock className="w-3 h-3" /> SELECTED
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-green-400 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/30">
                    <LockOpen className="w-3 h-3" /> AVAILABLE
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{problem.title}</h3>
              <p className="text-sm font-semibold text-[#00f3ff] uppercase tracking-wider">{problem.difficulty} Difficulty</p>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-between">
              <p className="text-gray-400 text-sm mb-6 line-clamp-4">{problem.description}</p>
              
              <button 
                onClick={() => handleSelect(problem.id)}
                disabled={problem.status === 'SELECTED' || selecting === problem.id}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                  problem.status === 'SELECTED' 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-transparent border border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black'
                }`}
              >
                {selecting === problem.id ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : problem.status === 'SELECTED' ? (
                  <><Shield className="w-5 h-5" /> LOCKED</>
                ) : (
                  <><FileCode2 className="w-5 h-5" /> SELECT THIS PROBLEM</>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
