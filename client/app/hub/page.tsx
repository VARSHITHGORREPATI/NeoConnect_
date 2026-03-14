"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { Search, FileText, Newspaper, TrendingUp, Download, ArrowRight } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

type Digest = { _id: string; title: string; summary: string; createdAt: string };
type Minutes = { _id: string; title: string; fileUrl: string; createdAt: string };

export default function PublicHubPage() {
  const [digests, setDigests] = useState<Digest[]>([]);
  const [minutes, setMinutes] = useState<Minutes[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    const load = async () => {
      const [d, m] = await Promise.all([
        axios.get(`${API_BASE}/digests`),
        axios.get(`${API_BASE}/minutes`),
      ]);
      setDigests(d.data);
      setMinutes(m.data);
    };
    load();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.get(`${API_BASE}/minutes/search`, {
      params: { q },
    });
    setMinutes(res.data);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
             <Newspaper className="h-6 w-6 text-indigo-600" /> Public Information Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">Access company-wide communications, impact tracking, and archived meeting minutes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Digest column */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden flex flex-col">
            <h2 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100 flex items-center justify-between">
              Quarterly Digests
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{digests.length} published</span>
            </h2>
            <div className="mt-4 flex-1">
              {digests.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center py-10 opacity-60">
                  <Newspaper className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-sm font-medium text-slate-500">No digest publications available.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {digests.map((d) => (
                    <article key={d._id} className="group cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-slate-300 hover:shadow-sm">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{d.title}</h3>
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-full">
                          {new Date(d.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{d.summary}</p>
                      <div className="mt-3 flex items-center text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Read full digest <ArrowRight className="w-3 h-3 ml-1" />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <div className="space-y-6 flex flex-col">
            {/* Impact Tracking */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 pb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" /> Resolution Impact
              </h2>
              <p className="text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                Transparent view of how recent feedback has driven organizational improvements.
              </p>
              
              <div className="space-y-4">
                <div className="group rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-4 transition-shadow hover:shadow-sm">
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Identified Issue</span>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">Recurring noise complaints in the open-plan engineering wing</p>
                    </div>
                    <div className="h-px bg-slate-100 w-full" />
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Action Taken</span>
                         <p className="text-xs font-medium text-slate-700 mt-0.5">Installed acoustic panels & established dedicated quiet zones</p>
                       </div>
                       <div>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Measured Result</span>
                         <p className="text-xs font-bold text-slate-900 mt-0.5">40% drop in related workflow interruptions in Q3</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Minutes Archive */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" /> Meeting Minutes
                </h2>
                <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-56">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search archive..."
                      className="w-full rounded-l-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs font-medium focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-r-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors border border-transparent"
                  >
                    Search
                  </button>
                </form>
              </div>

              {minutes.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-6 opacity-60">
                  <p className="text-sm font-medium text-slate-500">No meeting minutes match criteria.</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {minutes.map((m) => (
                    <li key={m._id} className="group relative flex items-center justify-between rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 p-2 pl-3 transition-colors">
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-slate-900">{m.title}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                          {new Date(m.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <a
                        href={m.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 opacity-0 group-hover:opacity-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
          
        </div>
      </div>
    </DashboardShell>
  );
}
