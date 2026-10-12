import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Users, FileCode2, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('hackathon_token')?.value;

  if (!token) throw new Error("Dashboard: No token");

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "team_leader") throw new Error("Dashboard: Invalid payload or role");

  const res = await fetch(`${API_BASE_URL}/api/team/${payload.teamId}`, { cache: 'no-store' });
  const team = await res.json();

  if (!team || team.error) {
    redirect("/login");
  }

  const leader = team.members.find((m: any) => m.isLeader);
  const otherMembers = team.members.filter((m: any) => !m.isLeader);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-12 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase break-words">WELCOME, {leader?.name}</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Team Leader Dashboard</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/problems" className="w-full sm:w-auto bg-[#00f3ff] text-black font-bold py-2.5 px-5 sm:px-6 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 text-xs sm:text-sm">
            <FileCode2 className="w-4 h-4 sm:w-5 sm:h-5" /> Problem Statements
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Team Info Card */}
        <div className="lg:col-span-2 glass-panel p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-[#00f3ff]/30 shadow-[0_0_20px_rgba(0,243,255,0.1)]">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6 border-b border-gray-800 pb-3 sm:pb-4">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#00f3ff]" />
            <h2 className="text-xl sm:text-2xl font-bold">Team Information</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 bg-black/40 p-3.5 sm:p-4 rounded-xl border border-gray-800">
            <div className="sm:col-span-1 md:col-span-3">
              <p className="text-gray-500 text-xs sm:text-sm">Team Name</p>
              <p className="text-xl sm:text-2xl font-bold text-white break-words">{team.teamName}</p>
            </div>
            <div className="sm:col-span-1 md:col-span-1">
              <p className="text-gray-500 text-xs sm:text-sm">Team ID</p>
              <p className="text-lg sm:text-xl font-bold text-[#00f3ff] neon-text-blue">{team.teamId}</p>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-3 sm:mb-4">Team Members</h3>
          <div className="space-y-2.5 sm:space-y-3">
            <div className="bg-[#9d00ff]/10 border border-[#9d00ff]/30 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
              <div>
                <p className="font-bold text-white text-sm sm:text-base flex items-center flex-wrap gap-2">
                  <span>{leader?.name}</span>
                  <span className="text-[10px] bg-[#9d00ff] text-white px-1.5 py-0.5 rounded font-bold">LEADER</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-400 break-all">{leader?.registerNumber} • {leader?.email}</p>
              </div>
            </div>
            {otherMembers.map((m: any) => (
              <div key={m.id} className="bg-black/40 border border-gray-800 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
                <div>
                  <p className="font-semibold text-gray-200 text-sm sm:text-base">{m.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500 break-all">{m.registerNumber} • {m.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Card */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl border-[#9d00ff]/30 shadow-[0_0_20px_rgba(157,0,255,0.1)] flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <FileCode2 className="w-6 h-6 text-[#9d00ff]" />
            <h2 className="text-xl font-bold">Selected Problem</h2>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {team.problemSelection ? (
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{team.problemSelection.problemStatement.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block bg-[#00f3ff]/10 text-[#00f3ff] text-xs font-semibold px-3 py-1 rounded-full border border-[#00f3ff]/30">
                        LOCKED
                      </span>
                      <span className="inline-block bg-[#9d00ff]/10 text-[#9d00ff] text-xs font-semibold px-3 py-1 rounded-full border border-[#9d00ff]/30">
                        {team.problemSelection.problemStatement.domain}
                      </span>
                      <span className="inline-block bg-yellow-500/10 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full border border-yellow-500/30">
                        {team.problemSelection.problemStatement.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-[#00f3ff]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-[#00f3ff]" />
                  </div>
                </div>
                
                <div className="flex-1 p-5 bg-black/40 rounded-xl border border-gray-800">
                  <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Problem Description</h4>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {team.problemSelection.problemStatement.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-6">No problem statement selected yet.</p>
                <Link href="/problems" className="inline-block bg-transparent neon-border-purple text-[#9d00ff] px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#9d00ff] hover:text-white transition-all">
                  SELECT PROBLEM
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
