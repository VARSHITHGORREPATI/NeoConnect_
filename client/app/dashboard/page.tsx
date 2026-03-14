"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/auth/useAuth";
import { DashboardShell } from "../../components/layout/DashboardShell";
import Link from "next/link";
import axios from "axios";
import { 
  Users, 
  Activity, 
  Target, 
  Briefcase, 
  ArrowRight, 
  ShieldCheck, 
  BarChart2, 
  Settings, 
  Globe2, 
  Vote, 
  MessageSquare,
  Sparkles,
  Zap,
  TrendingUp,
  Clock
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        if (user.role === "admin") {
          const res = await axios.get(`${API_BASE}/users`);
          const users = res.data as Array<{ role: string }>;
          const counts = users.reduce<Record<string, number>>((acc, u) => {
            acc[u.role] = (acc[u.role] || 0) + 1;
            return acc;
          }, {});
          setSummary({ type: "users", counts, total: users.length });
        } else if (user.role === "secretariat") {
          const res = await axios.get(`${API_BASE}/analytics`);
          setSummary({ type: "analytics", ...res.data });
        } else if (user.role === "case_manager") {
          const res = await axios.get(`${API_BASE}/cases`, {
            params: { assignedTo: user.id },
          });
          setSummary({ type: "assigned", total: res.data.length });
        } else {
          const res = await axios.get(`${API_BASE}/cases`);
          setSummary({ type: "cases", total: res.data.length });
        }
      } catch {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (!user) return null;

  return (
    <DashboardShell>
      <div className="space-y-8 animate-fade-in">
        
        {/* Hero Welcome Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-10 shadow-2xl">
          {/* Animated Background Graphics */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-600/20 rounded-full blur-[80px] animate-blob"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-600/20 rounded-full blur-[80px] animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-blue-200 text-xs font-black uppercase tracking-[0.2em]">
                <Sparkles className="w-3 h-3" /> System Overview
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{user.name.split(' ')[0]}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">{user.role.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm text-slate-300">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-bold uppercase tracking-wider">{user.department}</span>
                </div>
              </div>
            </div>
            
            <div className="shrink-0">
               <Link 
                  href={user.role === "staff" ? "/staff/submit" : user.role === "secretariat" ? "/secretariat" : user.role === "case_manager" ? "/case-manager" : "/admin"}
                  className="inline-flex items-center justify-center gap-3 rounded-[2rem] bg-white px-8 py-4 text-sm font-black text-slate-900 hover:bg-slate-100 hover:-translate-y-1 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] group"
               >
                 <span>LAUNCH CONSOLE</span>
                 <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Performance Card */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-white bg-white/60 backdrop-blur-xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] hover:shadow-xl hover:shadow-blue-500/5 transition-all animate-slide-up premium-border">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Platform Velocity</h3>
            <p className="text-2xl font-black text-slate-900 mb-6">
              {user.role === "staff" ? "Lodge new query" : "Action Center"}
            </p>
            <Link
              href={user.role === "staff" ? "/staff/submit" : "/dashboard"}
              className="inline-flex items-center text-xs font-black text-blue-600 hover:gap-3 transition-all uppercase tracking-widest"
            >
              Execute <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Core Metric Card */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-white bg-white/60 backdrop-blur-xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] hover:shadow-xl hover:shadow-indigo-500/5 transition-all animate-slide-up animation-delay-2000 premium-border">
             <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
               <TrendingUp className="h-6 w-6" />
             </div>
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
               {user.role === "admin" ? "Global Personnel" : "Active Record Count"}
             </h3>
             <div className="flex items-baseline gap-2">
               <span className="text-5xl font-black text-slate-900 tracking-tighter">
                 {loading ? "..." : summary?.total ?? "0"}
               </span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Units</span>
             </div>
          </div>

          {/* Integrations Card */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-white bg-white/60 backdrop-blur-xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] hover:shadow-xl hover:shadow-emerald-500/5 transition-all animate-slide-up animation-delay-4000 premium-border">
             <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
               <Globe2 className="h-6 w-6" />
             </div>
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Discovery</h3>
             <div className="grid grid-cols-2 gap-3">
               <Link href="/hub" className="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all text-slate-600 hover:text-emerald-700">
                 <Globe2 className="h-5 w-5" />
                 <span className="text-[10px] font-bold uppercase tracking-wider">Hub</span>
               </Link>
               <Link href="/polls" className="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all text-slate-600 hover:text-emerald-700">
                 <Vote className="h-5 w-5" />
                 <span className="text-[10px] font-bold uppercase tracking-wider">Polls</span>
               </Link>
             </div>
          </div>
        </div>

        {/* Contextual Distribution Section */}
        {user.role === "admin" && summary?.type === "users" && (
          <div className="rounded-[2.5rem] border border-white bg-white/60 backdrop-blur-xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] premium-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Personnel Infrastructure</h2>
                <p className="text-sm font-semibold text-slate-500 mt-1">Real-time distribution of organizational system credentials.</p>
              </div>
              <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-black text-slate-900 bg-white border border-slate-200 px-6 py-3 rounded-2xl hover:shadow-lg transition-all shadow-sm">
                <Settings className="h-4 w-4" /> USER CONFIGURATION
              </Link>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "staff", icon: Users, color: "blue" },
                { label: "secretariat", icon: ShieldCheck, color: "indigo" },
                { label: "case_manager", icon: Activity, color: "purple" },
                { label: "admin", icon: Zap, color: "slate" }
              ].map((r) => {
                const count = summary.counts?.[r.label] ?? 0;
                return (
                  <div key={r.label} className="group relative rounded-3xl border border-slate-100 bg-white p-6 transition-all hover:scale-[1.02] hover:shadow-xl shadow-sm overflow-hidden">
                    <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-500`}>
                      <r.icon className="w-16 h-16" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{r.label.replace('_', ' ')}</span>
                       <span className="text-4xl font-black text-slate-900 tracking-tighter">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer info snippet */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Clock className="w-3.5 h-3.5" /> Session Active
          </div>
           <div className="flex items-center gap-6">
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2026 NeoConnect Enterprise</span>
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}
