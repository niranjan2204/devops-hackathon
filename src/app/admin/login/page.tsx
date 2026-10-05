"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex items-center justify-center p-4 relative z-10 min-h-[80vh]">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-gray-800 shadow-[0_0_30px_rgba(255,0,234,0.15)]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#ff00ea] to-[#9d00ff] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_#ff00ea]">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-widest uppercase">Admin Override</h2>
          <p className="text-gray-400 text-sm mt-2 font-mono">Restricted Access Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">
              Passcode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-lg py-4 px-4 text-white focus:outline-none focus:border-[#ff00ea] focus:ring-1 focus:ring-[#ff00ea] transition-all font-mono tracking-widest text-center"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#ff00ea] to-[#9d00ff] text-white font-bold py-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                AUTHENTICATE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
           <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm font-bold uppercase tracking-wider transition-colors">
             Return to Base
           </Link>
        </div>
      </div>
    </div>
  );
}
