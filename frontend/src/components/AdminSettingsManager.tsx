"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Calendar } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

const toLocalISOString = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function AdminSettingsManager() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/settings`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setConfig(data);
        } else {
          setConfig({}); // fallback to empty object if error
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        alert("Settings saved successfully!");
      } else {
        const errorData = await res.json();
        alert(`Failed to save settings: ${errorData.error || "Unknown error"}`);
      }
    } catch (e: any) {
      alert(`Error saving settings: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-12 animate-pulse">Loading Settings...</div>;
  }

  return (
    <div className="w-full mt-8">
      <div className="glass-panel p-6 md:p-8 rounded-xl border border-gray-800">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-yellow-400">
          <Settings className="w-5 h-5" /> DevSprint Configuration
        </h2>
        
        <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Timing Section */}
            <div className="bg-black/40 p-4 sm:p-6 rounded-xl border border-gray-800 h-fit space-y-5 sm:space-y-6">
              <h3 className="text-[#00f3ff] font-bold flex items-center gap-2 uppercase tracking-wide text-xs sm:text-sm">
                <Calendar className="w-4 h-4" /> Registration & Timing
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Hackathon Name</label>
                  <input 
                    type="text" 
                    required
                    value={config.hackathonName || "DevSprint 2026"}
                    onChange={(e) => setConfig({...config, hackathonName: e.target.value})}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 px-3 sm:px-4 text-white focus:outline-none focus:border-[#00f3ff] transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Maximum Allowed Teams</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={config.maxTeams ?? 30}
                    onChange={(e) => setConfig({...config, maxTeams: parseInt(e.target.value)})}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 px-3 sm:px-4 text-white focus:outline-none focus:border-[#00f3ff] transition-all text-sm"
                  />
                </div>
                <div className="pt-2 border-t border-gray-800">
                  <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Hackathon Start Date</label>
                  <input 
                    type="datetime-local" 
                    required
                    defaultValue={toLocalISOString(config.hackathonStart)}
                    onChange={(e) => setConfig({...config, hackathonStart: e.target.value})}
                    onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 px-3 sm:px-4 text-white focus:outline-none focus:border-[#00f3ff] transition-all cursor-pointer text-xs sm:text-sm"
                  />
                </div>
                <div className="pt-2 border-t border-gray-800">
                  <label className="block text-gray-400 text-xs font-bold mb-2 uppercase text-[#ffaa00]">Problem Selection Window Start</label>
                  <input 
                    type="datetime-local" 
                    required
                    defaultValue={toLocalISOString(config.selectionStart)}
                    onChange={(e) => setConfig({...config, selectionStart: e.target.value})}
                    onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 px-3 sm:px-4 text-white focus:outline-none focus:border-[#ffaa00] transition-all cursor-pointer text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-2 uppercase text-[#ffaa00]">Problem Selection Window End</label>
                  <input 
                    type="datetime-local" 
                    required
                    defaultValue={toLocalISOString(config.selectionEnd)}
                    onChange={(e) => setConfig({...config, selectionEnd: e.target.value})}
                    onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 px-3 sm:px-4 text-white focus:outline-none focus:border-[#ffaa00] transition-all cursor-pointer text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="bg-black/40 p-4 sm:p-6 rounded-xl border border-gray-800 h-fit space-y-5 sm:space-y-6">
              <h3 className="text-[#ff00ea] font-bold flex items-center gap-2 uppercase tracking-wide text-xs sm:text-sm">
                Contact Details
              </h3>
              
              <div className="space-y-4 sm:space-y-6">
                
                {/* Faculty */}
                <div className="space-y-3 p-3.5 sm:p-4 border border-[#ff00ea]/20 rounded-lg bg-black/20">
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider">Faculty Coordinator</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <input type="text" placeholder="Name" value={config.facultyName || ""} onChange={(e) => setConfig({...config, facultyName: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded py-1.5 px-3 text-white focus:outline-none focus:border-[#ff00ea] text-xs sm:text-sm" />
                    <input type="text" placeholder="Phone" value={config.facultyPhone || ""} onChange={(e) => setConfig({...config, facultyPhone: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded py-1.5 px-3 text-white focus:outline-none focus:border-[#ff00ea] text-xs sm:text-sm" />
                  </div>
                  <input type="email" placeholder="Email" value={config.facultyEmail || ""} onChange={(e) => setConfig({...config, facultyEmail: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded py-1.5 px-3 text-white focus:outline-none focus:border-[#ff00ea] text-xs sm:text-sm" />
                </div>

                {/* Organizer 1 */}
                <div className="space-y-3 p-3.5 sm:p-4 border border-[#00f3ff]/20 rounded-lg bg-black/20">
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider">Organizer 1</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <input type="text" placeholder="Name" value={config.org1Name || ""} onChange={(e) => setConfig({...config, org1Name: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded py-1.5 px-3 text-white focus:outline-none focus:border-[#00f3ff] text-xs sm:text-sm" />
                    <input type="text" placeholder="Phone" value={config.org1Phone || ""} onChange={(e) => setConfig({...config, org1Phone: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded py-1.5 px-3 text-white focus:outline-none focus:border-[#00f3ff] text-xs sm:text-sm" />
                  </div>
                  <input type="email" placeholder="Email" value={config.org1Email || ""} onChange={(e) => setConfig({...config, org1Email: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded py-1.5 px-3 text-white focus:outline-none focus:border-[#00f3ff] text-xs sm:text-sm" />
                </div>

                {/* Organizer 2 */}
                <div className="space-y-3 p-3.5 sm:p-4 border border-[#00f3ff]/20 rounded-lg bg-black/20">
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider">Organizer 2</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <input type="text" placeholder="Name" value={config.org2Name || ""} onChange={(e) => setConfig({...config, org2Name: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded py-1.5 px-3 text-white focus:outline-none focus:border-[#00f3ff] text-xs sm:text-sm" />
                    <input type="text" placeholder="Phone" value={config.org2Phone || ""} onChange={(e) => setConfig({...config, org2Phone: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded py-1.5 px-3 text-white focus:outline-none focus:border-[#00f3ff] text-xs sm:text-sm" />
                  </div>
                  <input type="email" placeholder="Email" value={config.org2Email || ""} onChange={(e) => setConfig({...config, org2Email: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded py-1.5 px-3 text-white focus:outline-none focus:border-[#00f3ff] text-xs sm:text-sm" />
                </div>

                {/* Location */}
                <div className="space-y-3 p-3.5 sm:p-4 border border-yellow-400/20 rounded-lg bg-black/20">
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider text-yellow-400">Event Location</h4>
                  <textarea 
                    placeholder="Full Address" 
                    value={config.contactAddress || ""} 
                    onChange={(e) => setConfig({...config, contactAddress: e.target.value})} 
                    className="w-full bg-black/50 border border-gray-700 rounded py-2 px-3 text-white focus:outline-none focus:border-yellow-400 text-xs sm:text-sm h-20 resize-none" 
                  />
                </div>

              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save Configuration</>}
          </button>
        </form>
      </div>
    </div>
  );
}
