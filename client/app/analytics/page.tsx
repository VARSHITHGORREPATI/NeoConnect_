"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { AlertCircle, TrendingUp, PieChart as PieChartIcon } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

type Agg = { _id: string; count: number };
type Hotspot = { department: string; category: string; count: number };

const COLORS = ["#0f172a", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AnalyticsDashboardPage() {
  const [byDepartment, setByDepartment] = useState<Agg[]>([]);
  const [byStatus, setByStatus] = useState<Agg[]>([]);
  const [byCategory, setByCategory] = useState<Agg[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_BASE}/analytics`);
        setByDepartment(res.data.byDepartment);
        setByStatus(res.data.byStatus);
        setByCategory(res.data.byCategory);
        setHotspots(res.data.hotspots);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics Insights</h1>
          <p className="text-sm text-slate-500 mt-1">Overall platform usage, hotspots, and department statistics.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900"></div>
            <p className="mt-4 text-sm font-medium text-slate-500 text-center animate-pulse">Computing data sets...</p>
          </div>
        ) : (
          <>
            {hotspots.length > 0 && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 text-red-100 opacity-50">
                  <AlertCircle className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <h2 className="flex items-center gap-2 mb-3 text-lg font-bold text-red-800">
                    <AlertCircle className="w-5 h-5" /> Activity Hotspots Detected
                  </h2>
                  <p className="text-xs text-red-600 font-medium mb-4 uppercase tracking-wider">Unusual volume across following vectors:</p>
                  <ul className="space-y-2">
                    {hotspots.map((h, idx) => (
                      <li key={idx} className="flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-red-100 max-w-lg">
                         <span className="font-bold text-slate-900">{h.department}</span>
                         <span className="text-slate-300">/</span>
                         <span className="font-medium text-slate-700">{h.category}</span>
                         <span className="ml-auto flex items-center gap-1 font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full text-xs">
                           {h.count} cases
                         </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                <h2 className="flex items-center gap-2 mb-6 text-base font-bold text-slate-900">
                  <TrendingUp className="w-5 h-5 text-slate-400" /> Volume by Department
                </h2>
                <div className="flex-1 w-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={byDepartment}>
                      <XAxis dataKey="_id" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#f1f5f9'}} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                <h2 className="flex items-center gap-2 mb-6 text-base font-bold text-slate-900">
                  <PieChartIcon className="w-5 h-5 text-slate-400" /> Resolution Status Distribution
                </h2>
                <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={byStatus}
                        dataKey="count"
                        nameKey="_id"
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={2}
                        label={({ _id }) => _id}
                      >
                        {byStatus.map((entry, index) => (
                          <Cell key={entry._id} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-100">
                 <h2 className="text-base font-bold text-slate-900">Distribution by Category</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Classification Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {byCategory.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">{c._id}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                            {c.count} records
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
