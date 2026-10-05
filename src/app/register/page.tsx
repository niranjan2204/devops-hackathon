"use client";

import { useState } from "react";
import { ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<any>(null);

  const [formData, setFormData] = useState({
    teamName: "",
    password: "",
    leader: { name: "", registerNumber: "", email: "", phone: "" },
    members: [
      { name: "", registerNumber: "", email: "" },
      { name: "", registerNumber: "", email: "" },
      { name: "", registerNumber: "", email: "" },
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
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
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData(prev => ({ ...prev, members: newMembers }));
  };

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 md:p-12 rounded-2xl max-w-2xl w-full text-center border-[#00f3ff]/50 shadow-[0_0_30px_rgba(0,243,255,0.2)]"
        >
          <div className="w-20 h-20 bg-[#00f3ff]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#00f3ff]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">TEAM REGISTERED SUCCESSFULLY</h1>
          <p className="text-gray-400 mb-8">Registration Status: <span className="text-green-400 font-bold">CONFIRMED</span></p>
          
          <div className="bg-black/50 rounded-xl p-6 mb-8 text-left border border-gray-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Team Name</p>
                <p className="text-xl font-bold text-white">{success.teamName}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Team ID</p>
                <p className="text-xl font-bold text-[#00f3ff] neon-text-blue">{success.teamId}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 text-sm">Team Leader</p>
                <p className="text-lg font-medium text-gray-300">{formData.leader.name}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-sm p-4 rounded-lg mb-8 flex items-start gap-3 text-left">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>Please save your Team ID and login credentials safely. You will need them to login to the portal.</p>
          </div>

          <Link href="/login" className="inline-block bg-[#00f3ff] text-black font-bold py-3 px-8 rounded-lg hover:bg-white hover:shadow-[0_0_15px_#00f3ff] transition-all">
            GO TO LOGIN
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center py-12 px-4 relative z-10">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">TEAM REGISTRATION</h1>
          <div className="flex items-center justify-center gap-2 text-[#9d00ff] bg-[#9d00ff]/10 border border-[#9d00ff]/30 py-2 px-4 rounded-lg inline-flex mx-auto">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-medium">Only the Team Leader should register the team.</span>
          </div>
        </div>

        <div className="glass-panel p-6 md:p-10 rounded-2xl border-gray-800 relative overflow-hidden">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Team Details */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">Team Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Team Name</label>
                  <input required type="text" value={formData.teamName} onChange={e => setFormData({...formData, teamName: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-[#00f3ff] focus:outline-none transition-colors" placeholder="e.g. Phoenix" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Portal Password (for Leader Login)</label>
                  <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-[#00f3ff] focus:outline-none transition-colors" placeholder="••••••••" minLength={6} />
                </div>
              </div>
            </div>

            {/* Team Leader */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">Team Leader</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                  <input required type="text" value={formData.leader.name} onChange={e => updateLeader("name", e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-[#00f3ff] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Register Number</label>
                  <input required type="text" value={formData.leader.registerNumber} onChange={e => updateLeader("registerNumber", e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-[#00f3ff] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">College Email ID</label>
                  <input required type="email" value={formData.leader.email} onChange={e => updateLeader("email", e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-[#00f3ff] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                  <input required type="tel" value={formData.leader.phone} onChange={e => updateLeader("phone", e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-[#00f3ff] focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Team Members */}
            {[0, 1, 2].map((index) => (
              <div key={index}>
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">Team Member {index + 1}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    <input required type="text" value={formData.members[index].name} onChange={e => updateMember(index, "name", e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-[#00f3ff] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Register Number</label>
                    <input required type="text" value={formData.members[index].registerNumber} onChange={e => updateMember(index, "registerNumber", e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-[#00f3ff] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">College Email ID</label>
                    <input required type="email" value={formData.members[index].email} onChange={e => updateMember(index, "email", e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-[#00f3ff] focus:outline-none" />
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-[#00f3ff]/10 border border-[#00f3ff]/30 p-4 rounded-lg mt-8">
              <p className="text-[#00f3ff] font-medium text-sm text-center">By submitting, you agree to the hackathon rules and confirm that all 4 members belong to Bannari Amman Institute of Technology.</p>
            </div>

            <div className="flex justify-center mt-8 pt-8 border-t border-gray-800">
              <button 
                type="submit"
                disabled={loading}
                className="bg-[#00f3ff] text-black w-full md:w-auto px-12 py-4 rounded-lg font-black tracking-widest hover:bg-white hover:shadow-[0_0_20px_#00f3ff] transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-lg"
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
