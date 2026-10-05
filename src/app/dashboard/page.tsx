import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Users, FileCode2, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) redirect("/login");

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "team_leader") redirect("/login");

  const team = await prisma.team.findUnique({
    where: { id: payload.teamId as string },
    include: {
      members: true,
      problemSelection: {
        include: {
          problemStatement: true
        }
      }
    }
  });

  if (!team) redirect("/login");

  const leader = team.members.find(m => m.isLeader);
  const otherMembers = team.members.filter(m => !m.isLeader);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase">WELCOME, {leader?.name}</h1>
          <p className="text-gray-400 mt-1">Team Leader Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/problems" className="bg-[#00f3ff] text-black font-bold py-2 px-6 rounded-lg hover:bg-white transition-all flex items-center gap-2">
            <FileCode2 className="w-5 h-5" /> Problem Statements
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Info Card */}
        <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-2xl border-[#00f3ff]/30 shadow-[0_0_20px_rgba(0,243,255,0.1)]">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <Users className="w-6 h-6 text-[#00f3ff]" />
            <h2 className="text-2xl font-bold">Team Information</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-black/40 p-4 rounded-xl border border-gray-800">
            <div className="col-span-2 md:col-span-3">
              <p className="text-gray-500 text-sm">Team Name</p>
              <p className="text-2xl font-bold text-white">{team.teamName}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-gray-500 text-sm">Team ID</p>
              <p className="text-xl font-bold text-[#00f3ff] neon-text-blue">{team.teamId}</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-300 mb-4">Team Members</h3>
          <div className="space-y-3">
            <div className="bg-[#9d00ff]/10 border border-[#9d00ff]/30 p-3 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold text-white">{leader?.name} <span className="text-xs bg-[#9d00ff] text-white px-2 py-0.5 rounded ml-2">LEADER</span></p>
                <p className="text-sm text-gray-400">{leader?.registerNumber} • {leader?.email}</p>
              </div>
            </div>
            {otherMembers.map(m => (
              <div key={m.id} className="bg-black/40 border border-gray-800 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-200">{m.name}</p>
                  <p className="text-sm text-gray-500">{m.registerNumber} • {m.email}</p>
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
