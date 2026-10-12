"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/lib/api";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [configLoading, setConfigLoading] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const [teamCount, setTeamCount] = useState(0);
  const [maxTeams, setMaxTeams] = useState(30);

  const [formData, setFormData] = useState({
    teamName: "",
    password: "",
    leader: { name: "", registerNumber: "", email: "", phone: "" },
    members: [
      { name: "", registerNumber: "", email: "" },
      { name: "", registerNumber: "", email: "" },
    ]
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/config`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          const max = data.maxTeams ?? 30;
          const count = data.teamCount ?? 0;
          setMaxTeams(max);
          setTeamCount(count);
          if (data.isRegistrationClosed || count >= max) {
            setIsClosed(true);
          }
        }
      })
      .catch(err => {
        console.error("Failed to fetch registration status:", err);
      })
      .finally(() => {
        setConfigLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error && (data.error.toLowerCase().includes("closed") || data.error.toLowerCase().includes("capacity"))) {
          setIsClosed(true);
        }
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(data.team);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateLeader = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, leader: { ...prev.leader, [field]: value } }));
  };

  const updateMember = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newMembers = [...prev.members];
      newMembers[index] = { ...newMembers[index], [field]: value };
      return { ...prev, members: newMembers };
    });
  };

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 py-8 sm:py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-5 sm:p-8 md:p-12 rounded-2xl max-w-2xl w-full text-center border-[#00f3ff]/50 shadow-[0_0_30px_rgba(0,243,255,0.2)]"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#00f3ff]/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#00f3ff]" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">TEAM REGISTERED SUCCESSFULLY</h1>
          <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">Registration Status: <span className="text-green-400 font-bold">CONFIRMED</span></p>
          
          <div className="bg-black/50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-left border border-gray-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Team Name</p>
                <p className="text-lg sm:text-xl font-bold text-white mt-0.5 break-words">{success.teamName}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Team ID</p>
                <p className="text-lg sm:text-xl font-bold text-[#00f3ff] neon-text-blue mt-0.5">{success.teamId}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Team Leader</p>
                <p className="text-base sm:text-lg font-medium text-gray-200 mt-0.5 break-words">{formData.leader.name}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Portal Password</p>
                <p className="text-base sm:text-lg font-bold text-yellow-400 mt-0.5 break-all">{formData.password}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs sm:text-sm p-3.5 sm:p-4 rounded-xl mb-6 sm:mb-8 flex items-start gap-3 text-left">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-yellow-400" />
            <p>Please save your Team ID and login credentials safely. You will need them to login to the portal.</p>
          </div>

          <Link href="/login" className="inline-block w-full sm:w-auto bg-[#00f3ff] text-black font-black py-3 px-8 rounded-xl hover:bg-white hover:shadow-[0_0_15px_#00f3ff] transition-all text-sm tracking-wider">
            GO TO LOGIN
          </Link>
        </motion.div>
      </div>
    );
  }

  if (configLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 min-h-[60vh] relative z-10">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00f3ff] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">Checking Registration Status...</p>
        </div>
      </div>
    );
  }

  if (isClosed) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 py-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-panel p-8 md:p-12 rounded-2xl max-w-xl w-full text-center border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.15)] relative overflow-hidden"
        >
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-[#ff00ea]" />

          {/* Icon */}
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <Lock className="w-10 h-10 text-red-400" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Maximum Capacity Reached
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-wide">
            REGISTRATION CLOSED
          </h1>

          <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
            Registrations for <span className="text-[#00f3ff] font-bold">DevSprint 2026</span> are now officially closed. All <span className="text-white font-bold">{maxTeams}</span> team slots have been filled.
          </p>

          {/* Stats Box */}
          <div className="bg-black/50 rounded-xl p-5 mb-8 border border-gray-800 grid grid-cols-2 gap-4">
            <div className="border-r border-gray-800 pr-2">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Slots Allocated</p>
              <p className="text-2xl font-black text-white">{teamCount} / {maxTeams}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Registration Status</p>
              <p className="text-2xl font-black text-red-400 uppercase">CLOSED</p>
            </div>
          </div>

          {/* Helpful Information */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 text-gray-300 text-sm p-4 rounded-xl mb-8 flex items-start gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <p>
              Already registered? You can log in using your Team Leader credentials to view challenge announcements and event updates.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/login" 
              className="bg-[#00f3ff] text-black font-black py-3 px-6 rounded-xl hover:bg-white hover:shadow-[0_0_20px_#00f3ff] transition-all tracking-wider text-sm flex items-center justify-center gap-2"
            >
              GO TO LOGIN
            </Link>
            <Link 
              href="/" 
              className="bg-white/5 border border-white/20 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/10 hover:border-white/40 transition-all tracking-wider text-sm flex items-center justify-center"
            >
              BACK TO HOME
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center py-6 sm:py-12 px-3 sm:px-4 relative z-10 w-full">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">DEVSPRINT 2026 REGISTRATION</h1>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-3">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[#9d00ff] bg-[#9d00ff]/10 border border-[#9d00ff]/30 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Only the Team Leader should register the team.</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[#00f3ff] bg-[#00f3ff]/10 border border-[#00f3ff]/30 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">{teamCount} / {maxTeams} Teams Registered</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 sm:p-6 md:p-10 rounded-xl sm:rounded-2xl border-gray-800 relative overflow-hidden">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 sm:p-4 rounded-lg mb-6 flex items-start gap-2.5 sm:gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
            {/* Team Details */}
            <div>
              <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-white border-b border-gray-800 pb-2">Team Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Team Name</label>
                  <input required type="text" value={formData.teamName} onChange={e => setFormData({...formData, teamName: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-[#00f3ff] focus:outline-none transition-colors" placeholder="e.g. Phoenix" />
                </div>
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Portal Password (for Leader Login)</label>
                  <div className="relative">
                    <input required type={showPassword ? "text" : "password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-[#00f3ff] focus:outline-none transition-colors pr-10" placeholder="••••••••" minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1">
                      {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Leader */}
            <div>
              <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-white border-b border-gray-800 pb-2">Team Leader</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input required type="text" value={formData.leader.name} onChange={e => updateLeader("name", e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-[#00f3ff] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Register Number <span className="text-red-500">*</span></label>
                  <input required type="text" value={formData.leader.registerNumber} onChange={e => updateLeader("registerNumber", e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-[#00f3ff] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">College Email ID <span className="text-red-500">*</span></label>
                  <input required type="email" value={formData.leader.email} onChange={e => updateLeader("email", e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-[#00f3ff] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input required type="tel" value={formData.leader.phone} onChange={e => updateLeader("phone", e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-[#00f3ff] focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Team Members */}
            {[0, 1].map((index) => (
              <div key={index}>
                <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-white border-b border-gray-800 pb-2">
                  Team Member {index + 1} {index === 1 && <span className="text-xs sm:text-sm font-normal text-gray-400">(Optional)</span>}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Full Name {index === 0 && <span className="text-red-500">*</span>}</label>
                    <input required={index === 0} type="text" value={formData.members[index].name} onChange={e => updateMember(index, "name", e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-[#00f3ff] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Register Number {index === 0 && <span className="text-red-500">*</span>}</label>
                    <input required={index === 0} type="text" value={formData.members[index].registerNumber} onChange={e => updateMember(index, "registerNumber", e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-[#00f3ff] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">College Email ID {index === 0 && <span className="text-red-500">*</span>}</label>
                    <input required={index === 0} type="email" value={formData.members[index].email} onChange={e => updateMember(index, "email", e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-[#00f3ff] focus:outline-none" />
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-[#00f3ff]/10 border border-[#00f3ff]/30 p-3 sm:p-4 rounded-xl mt-6 sm:mt-8">
              <p className="text-[#00f3ff] font-medium text-xs sm:text-sm text-center">By submitting, you agree to the DevSprint 2026 rules and confirm that all members belong to Bannari Amman Institute of Technology.</p>
            </div>

            <div className="flex justify-center mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800">
              <button 
                type="submit"
                disabled={loading}
                className="bg-[#00f3ff] text-black w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-4 rounded-xl font-black tracking-widest hover:bg-white hover:shadow-[0_0_20px_#00f3ff] transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-lg"
              >
                {loading ? "PROCESSING..." : "CONFIRM & REGISTER TEAM"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
