"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardShell } from "../../../components/layout/DashboardShell";
import { FolderOpenDot, Hash, MapPin, Tag, Calendar, AlertTriangle } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

type Case = {
  _id: string;
  trackingId: string;
  category: string;
  department: string;
  severity: string;
  status: string;
  createdAt: string;
};

export default function StaffCasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_BASE}/cases`);
        setCases(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200 ring-red-500/20";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20";
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/20";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "resolved":
      case "closed":
        return "bg-emerald-100 text-emerald-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Submitted Cases</h1>
            <p className="text-sm text-slate-500 mt-1">Track the resolution progress of your queries and complaints.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900"></div>
              <p className="text-sm font-medium text-slate-500 animate-pulse">Loading cases...</p>
            </div>
          ) : cases.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center space-y-4">
              <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                <FolderOpenDot className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <p className="font-bold text-lg text-slate-900">No Cases Found</p>
                <p className="text-sm font-medium text-slate-500 mt-1">You haven't submitted any cases yet.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tracking Record</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categorization</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Severity Level</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Details & Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 block sm:table-row-group">
                  {cases.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                         <div className="flex flex-col">
                           <span className="font-bold text-slate-900 flex items-center gap-1.5">
                             <Hash className="w-3.5 h-3.5 text-slate-400" /> {c.trackingId}
                           </span>
                           <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider flex items-center gap-1">
                             <Calendar className="w-3 h-3" /> {new Date(c.createdAt).toLocaleDateString()}
                           </span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                            <Tag className="w-3.5 h-3.5 text-slate-400" /> {c.category}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {c.department} Dept
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm ring-1 ring-inset ${getSeverityBadge(c.severity)}`}>
                           {c.severity?.toLowerCase() === 'high' && <AlertTriangle className="w-3 h-3" />}
                           {c.severity}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${getStatusBadge(c.status)}`}>
                            {c.status?.replace("_", " ")}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
