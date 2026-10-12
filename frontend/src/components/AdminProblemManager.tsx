"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, CheckCircle2, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export default function AdminProblemManager({ initialProblems }: { initialProblems: any[] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  const handleAddProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const url = editingId ? `${API_BASE_URL}/api/admin/problems?id=${editingId}` : `${API_BASE_URL}/api/admin/problems`;
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, domain, difficulty }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${editingId ? 'update' : 'add'} problem`);

      setSuccess(`Problem ${editingId ? 'updated' : 'added'} successfully!`);
      setTitle("");
      setDescription("");
      setDomain("");
      setDifficulty("Intermediate");
      setEditingId(null);
      router.refresh(); // refresh the server component to pull new data
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this problem statement?")) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/problems?id=${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete problem");
      if (editingId === id) cancelEdit();
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  }

  const handleEdit = (prob: any) => {
    setTitle(prob.title);
    setDescription(prob.description);
    setDomain(prob.domain);
    setDifficulty(prob.difficulty);
    setEditingId(prob.id);
    setError("");
    setSuccess("");
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setTitle("");
    setDescription("");
    setDomain("");
    setDifficulty("Intermediate");
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const exportToCSV = () => {
    if (initialProblems.length === 0) return;
    
    const headers = ["ID", "Title", "Domain", "Difficulty", "Status", "Description"];
    const csvRows = [headers.join(",")];
    
    initialProblems.forEach(prob => {
      const row = [
        prob.id,
        `"${prob.title.replace(/"/g, '""')}"`,
        `"${prob.domain.replace(/"/g, '""')}"`,
        prob.difficulty,
        prob.status || 'AVAILABLE',
        `"${prob.description.replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(","));
    });
    
    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'hackathon_problems.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-1 glass-panel p-6 rounded-xl border border-gray-800 h-fit">
        <h2 className="text-xl font-bold mb-4 text-[#00f3ff] flex items-center gap-2">
          {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />} 
          {editingId ? "Edit Problem" : "Add New Problem"}
        </h2>
        
        {error && <div className="p-3 mb-4 rounded bg-red-900/50 border border-red-500/50 text-red-200 text-sm">{error}</div>}
        {success && <div className="p-3 mb-4 rounded bg-green-900/50 border border-green-500/50 text-green-200 text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {success}</div>}

        <form onSubmit={handleAddProblem} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
            <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-[#00f3ff] outline-none transition-colors" placeholder="e.g. Automated CI/CD Auditor" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-[#00f3ff] outline-none transition-colors" placeholder="Detailed problem statement..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Domain</label>
            <input required type="text" value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-[#00f3ff] outline-none transition-colors" placeholder="e.g. Docker / Security" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-[#00f3ff] outline-none transition-colors">
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button disabled={loading} type="submit" className="flex-1 bg-gradient-to-r from-[#00f3ff] to-[#ff00ea] text-white font-bold py-3 rounded hover:opacity-90 transition-opacity flex justify-center items-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? "Update Problem" : "Publish Problem")}
            </button>
            {editingId && (
              <button disabled={loading} type="button" onClick={cancelEdit} className="px-6 bg-gray-800 text-white font-bold py-3 rounded hover:bg-gray-700 transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-xl font-bold">Active Problem Statements ({initialProblems.length})</h2>
          <button 
            onClick={exportToCSV}
            disabled={initialProblems.length === 0}
            className="bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]/50 px-4 py-2 rounded font-bold text-sm hover:bg-[#00f3ff] hover:text-black transition-all disabled:opacity-50 whitespace-nowrap"
          >
            Export to CSV
          </button>
        </div>
        <div className="space-y-4">
          {initialProblems.length === 0 ? (
            <p className="text-gray-500 italic">No problem statements have been posted yet.</p>
          ) : (
            initialProblems.map((prob) => (
              <div key={prob.id} className="p-4 rounded-lg bg-black/40 border border-gray-800 relative group">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#00f3ff] font-mono inline-block font-bold">{prob.domain}</span>
                    <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border ${
                      prob.difficulty === 'Expert' ? 'border-red-500 text-red-400' :
                      prob.difficulty === 'Advanced' ? 'border-orange-500 text-orange-400' :
                      prob.difficulty === 'Intermediate' ? 'border-yellow-500 text-yellow-400' :
                      'border-green-500 text-green-400'
                    }`}>{prob.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleEdit(prob)} className="text-gray-400 hover:text-[#00f3ff] transition-colors p-1" title="Edit problem">
                      <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button onClick={() => handleDelete(prob.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Delete problem">
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">{prob.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">{prob.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
