"use client";

import { useState } from "react";
import AdminProblemManager from "./AdminProblemManager";
import AdminTeamManager from "./AdminTeamManager";
import { FileCode2, Users, Settings } from "lucide-react";

import AdminSettingsManager from "./AdminSettingsManager";

export default function AdminDashboardTabs({ initialProblems }: { initialProblems: any[] }) {
  const [activeTab, setActiveTab] = useState<"problems" | "teams" | "settings">("teams");

  return (
    <div className="w-full mt-6 sm:mt-10">
      <div className="flex overflow-x-auto border-b border-gray-800 mb-6 gap-1 sm:gap-2 pb-0.5 whitespace-nowrap">
        <button 
          onClick={() => setActiveTab("teams")}
          className={`flex items-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-colors border-b-2 flex-shrink-0 ${activeTab === "teams" ? "border-[#00f3ff] text-[#00f3ff]" : "border-transparent text-gray-500 hover:text-gray-300"}`}
        >
          <Users className="w-4 h-4" /> Team Approvals
        </button>
        <button 
          onClick={() => setActiveTab("problems")}
          className={`flex items-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-colors border-b-2 flex-shrink-0 ${activeTab === "problems" ? "border-[#ff00ea] text-[#ff00ea]" : "border-transparent text-gray-500 hover:text-gray-300"}`}
        >
          <FileCode2 className="w-4 h-4" /> Problem Statements
        </button>
        <button 
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-colors border-b-2 flex-shrink-0 ${activeTab === "settings" ? "border-yellow-400 text-yellow-400" : "border-transparent text-gray-500 hover:text-gray-300"}`}
        >
          <Settings className="w-4 h-4" /> DevSprint Settings
        </button>
      </div>

      {activeTab === "teams" && <AdminTeamManager />}
      {activeTab === "problems" && <AdminProblemManager initialProblems={initialProblems} />}
      {activeTab === "settings" && <AdminSettingsManager />}
      
    </div>
  );
}
