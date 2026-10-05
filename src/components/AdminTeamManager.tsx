"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Users, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

export default function AdminTeamManager() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/admin/teams");
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        if (res.redirected || res.url.includes('/login')) {
          window.location.href = '/admin/login';
        }
        return;
      }

      const data = await res.json();
      if (data.success) {
        setTeams(data.teams);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const updateStatus = async (teamId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, status })
      });
      if (res.ok) {
        fetchTeams();
      }
    } catch (e) {
      alert("Failed to update team status");
    }
  };

  const deleteTeam = async (teamId: string) => {
    if (!confirm("Are you sure you want to permanently delete this team? This action cannot be undone.")) return;
    try {
      const res = await fetch("/api/admin/teams", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId })
      });
      if (res.ok) {
        fetchTeams();
      } else {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const err = await res.json();
          alert(`Failed to delete team: ${err.error || "Unknown error"}`);
        } else {
          if (res.redirected || res.url.includes('/login')) {
            window.location.href = '/admin/login';
          } else {
            alert("Failed to delete team (Network error or Unauthorized)");
          }
        }
      }
    } catch (e) {
      alert("Failed to delete team");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-12 animate-pulse">Loading Teams Database...</div>;
  }

  return (
    <div className="w-full mt-8">
      <div className="glass-panel p-6 rounded-xl border border-gray-800">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#00f3ff]" /> Registered Teams
        </h2>
        
        <div className="space-y-4">
          {teams.length === 0 ? (
            <p className="text-gray-500 italic">No teams have registered yet.</p>
          ) : (
            teams.map((team) => (
              <div key={team.id} className="border border-gray-800 rounded-lg overflow-hidden bg-black/40">
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-900/50 transition-colors"
                  onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                >
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      team.status === 'APPROVED' || team.status === 'CONFIRMED' ? 'border-green-500 text-green-400 bg-green-900/20' :
                      team.status === 'REJECTED' ? 'border-red-500 text-red-400 bg-red-900/20' :
                      'border-yellow-500 text-yellow-400 bg-yellow-900/20'
                    }`}>
                      {team.status}
                    </span>
                    <h3 className="text-lg font-bold text-white">{team.teamName}</h3>
                    <span className="text-gray-500 text-sm">({team.members.length} members)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {expandedTeam === team.id ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                  </div>
                </div>

                {expandedTeam === team.id && (
                  <div className="p-4 border-t border-gray-800 bg-black/60">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-[#00f3ff] text-sm font-bold mb-3 uppercase tracking-wider">Team Members</h4>
                        <div className="space-y-2">
                          {team.members.map((m: any) => (
                            <div key={m.id} className="text-sm">
                              <span className="text-white font-medium">{m.name}</span>
                              {m.isLeader && <span className="ml-2 text-xs bg-[#ff00ea]/20 text-[#ff00ea] px-2 py-0.5 rounded">Leader</span>}
                              <div className="text-gray-400 text-xs mt-0.5">{m.email} | {m.registerNumber}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-[#00f3ff] text-sm font-bold mb-3 uppercase tracking-wider">Admin Actions</h4>
                        <p className="text-gray-400 text-xs mb-4">Only APPROVED teams can login to the portal and select problem statements.</p>
                        
                        <div className="flex flex-wrap gap-3">
                          <button 
                            onClick={() => updateStatus(team.id, 'APPROVED')}
                            disabled={team.status === 'APPROVED' || team.status === 'CONFIRMED'}
                            className="flex items-center gap-2 px-4 py-2 rounded bg-green-900/30 text-green-400 border border-green-500/50 hover:bg-green-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold"
                          >
                            <CheckCircle className="w-4 h-4" /> Approve Team
                          </button>
                          
                          <button 
                            onClick={() => updateStatus(team.id, 'REJECTED')}
                            disabled={team.status === 'REJECTED'}
                            className="flex items-center gap-2 px-4 py-2 rounded bg-red-900/30 text-red-400 border border-red-500/50 hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold"
                          >
                            <XCircle className="w-4 h-4" /> Reject Team
                          </button>

                          <button 
                            onClick={() => updateStatus(team.id, 'PENDING')}
                            disabled={team.status === 'PENDING'}
                            className="flex items-center gap-2 px-4 py-2 rounded bg-yellow-900/30 text-yellow-400 border border-yellow-500/50 hover:bg-yellow-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold"
                          >
                            <Clock className="w-4 h-4" /> Set Pending
                          </button>
                          
                          <div className="w-px h-8 bg-gray-800 mx-2 hidden sm:block"></div>
                          
                          <button 
                            onClick={() => deleteTeam(team.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded bg-red-950 text-red-500 border border-red-900 hover:bg-red-900 transition-colors text-sm font-bold"
                          >
                            <Trash2 className="w-4 h-4" /> Delete Team
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
