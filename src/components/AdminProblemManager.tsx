"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminProblemManager({ initialProblems }: { initialProblems: any[] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleAddProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, domain, difficulty }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add problem");

      setSuccess("Problem added successfully!");
      setTitle("");
      setDescription("");
      setDomain("");
      setDifficulty("Intermediate");
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
      const res = await fetch(`/api/admin/problems?id=${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete problem");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="w-full mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-1 glass-panel p-6 rounded-xl border border-gray-800 h-fit">
        <h2 className="text-xl font-bold mb-4 text-[#00f3ff] flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add New Problem
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
          <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-[#00f3ff] to-[#ff00ea] text-white font-bold py-3 rounded hover:opacity-90 transition-opacity flex justify-center items-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Problem"}
          </button>
        </form>
      </div>

      {/* List Section */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Active Problem Statements ({initialProblems.length})</h2>
        <div className="space-y-4">
          {initialProblems.length === 0 ? (
            <p className="text-gray-500 italic">No problem statements have been posted yet.</p>
          ) : (
            initialProblems.map((prob) => (
              <div key={prob.id} className="p-4 rounded-lg bg-black/40 border border-gray-800 relative group">
                <div className="absolute top-4 right-4 flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    prob.difficulty === 'Expert' ? 'border-red-500 text-red-400' :
                    prob.difficulty === 'Advanced' ? 'border-orange-500 text-orange-400' :
                    prob.difficulty === 'Intermediate' ? 'border-yellow-500 text-yellow-400' :
                    'border-green-500 text-green-400'
                  }`}>{prob.difficulty}</span>
                  <button onClick={() => handleDelete(prob.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 pr-24">{prob.title}</h3>
                <span className="text-xs text-[#00f3ff] font-mono mb-2 inline-block">{prob.domain}</span>
                <p className="text-gray-400 text-sm mt-2">{prob.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
