import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Server, FileCode2, Clock } from "lucide-react";
import AdminDashboardTabs from "@/components/AdminDashboardTabs";
import { API_BASE_URL } from "@/lib/api";

export default async function AdminDashboardPage() {
  const res = await fetch(`${API_BASE_URL}/api/admin/stats`, { cache: 'no-store' });
  const data = await res.json();
  
  const totalTeams = data.totalTeams;
  const maxTeams = data.maxTeams;
  
  const totalProblems = data.totalProblems;
  const selectedProblems = data.selectedProblems;
  const problems = data.problems;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 relative z-10">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold uppercase text-[#ff00ea] neon-text-magenta">ADMIN DASHBOARD</h1>
        <p className="text-gray-400 mt-1">Hackathon Overview & Statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass-panel p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-[#00f3ff]" />
            <h3 className="text-gray-400 font-semibold text-sm uppercase">Registered Teams</h3>
          </div>
          <p className="text-3xl font-bold text-white">{totalTeams} <span className="text-gray-600 text-lg">/ {maxTeams}</span></p>
          <div className="w-full bg-gray-800 h-2 rounded-full mt-4">
            <div className="bg-[#00f3ff] h-2 rounded-full" style={{ width: `${(totalTeams/maxTeams)*100}%` }}></div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <Server className="w-5 h-5 text-[#9d00ff]" />
            <h3 className="text-gray-400 font-semibold text-sm uppercase">Remaining Slots</h3>
          </div>
          <p className="text-3xl font-bold text-white">{maxTeams - totalTeams}</p>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <FileCode2 className="w-5 h-5 text-[#ff00ea]" />
            <h3 className="text-gray-400 font-semibold text-sm uppercase">Problem Statements</h3>
          </div>
          <p className="text-3xl font-bold text-white">{selectedProblems} <span className="text-gray-600 text-lg">/ {totalProblems}</span></p>
          <p className="text-xs text-gray-500 mt-2">Selected / Total Available</p>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <h3 className="text-gray-400 font-semibold text-sm uppercase">Hackathon Status</h3>
          </div>
          <p className="text-2xl font-bold text-green-400 mt-2">ACTIVE</p>
        </div>
      </div>
      
      <AdminDashboardTabs initialProblems={problems} />
    </div>
  );
}
