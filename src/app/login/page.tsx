"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, AlertCircle, LogIn, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState<"leader" | "admin">("leader");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = role === "admin" ? "/api/admin/login" : "/api/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push(role === "admin" ? "/admin" : "/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 md:p-10 rounded-3xl max-w-md w-full border-[#00f3ff]/30 shadow-[0_0_40px_rgba(0,243,255,0.15)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#ff00ea]/20 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#00f3ff]/20 to-transparent rounded-tr-full"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-black mb-2 uppercase tracking-widest text-white">
            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#ff00ea]">Access</span>
          </h1>
          <p className="text-gray-400 font-mono text-sm">Enter your credentials to proceed</p>
        </div>

        {/* Role Selector */}
        <div className="flex bg-black/50 p-1 rounded-xl mb-8 relative z-10 border border-gray-800">
          <button 
            onClick={() => { setRole("leader"); setError(""); }}
            className={`flex-1 py-3 text-sm font-bold tracking-wider rounded-lg transition-all flex justify-center items-center gap-2 ${role === "leader" ? "bg-gradient-to-r from-[#00f3ff]/20 to-[#00f3ff]/10 text-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.2)] border border-[#00f3ff]/30" : "text-gray-500 hover:text-gray-300"}`}
          >
            <User className="w-4 h-4" /> Team Leader
          </button>
          <button 
            onClick={() => { setRole("admin"); setError(""); }}
            className={`flex-1 py-3 text-sm font-bold tracking-wider rounded-lg transition-all flex justify-center items-center gap-2 ${role === "admin" ? "bg-gradient-to-r from-[#ff00ea]/20 to-[#ff00ea]/10 text-[#ff00ea] shadow-[0_0_15px_rgba(255,0,234,0.2)] border border-[#ff00ea]/30" : "text-gray-500 hover:text-gray-300"}`}
          >
            <Shield className="w-4 h-4" /> Admin
          </button>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 rounded-lg bg-red-900/30 border border-red-500/50 flex items-start gap-3 relative z-10">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className={`w-5 h-5 ${role === "admin" ? "text-[#ff00ea]" : "text-[#00f3ff]"}`} />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-black/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-${role === "admin" ? "[#ff00ea]" : "[#00f3ff]"} focus:ring-1 focus:ring-${role === "admin" ? "[#ff00ea]" : "[#00f3ff]"} transition-all placeholder-gray-600`}
                placeholder={role === "admin" ? "admin@bitsathy.ac.in" : "leader@team.com"}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className={`w-5 h-5 ${role === "admin" ? "text-[#ff00ea]" : "text-[#00f3ff]"}`} />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-black/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-${role === "admin" ? "[#ff00ea]" : "[#00f3ff]"} focus:ring-1 focus:ring-${role === "admin" ? "[#ff00ea]" : "[#00f3ff]"} transition-all placeholder-gray-600`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full text-white font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
              role === "admin" ? "bg-gradient-to-r from-[#ff00ea] to-[#9d00ff]" : "bg-gradient-to-r from-[#00f3ff] to-[#0088ff]"
            }`}
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
              <>
                <LogIn className="w-5 h-5" />
                AUTHENTICATE
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
