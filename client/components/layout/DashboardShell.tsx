"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../auth/useAuth";
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpenDot, 
  Globe2, 
  BarChart3, 
  ShieldAlert, 
  LogOut, 
  Settings,
  MessageSquare,
  Vote,
  ChevronRight
} from "lucide-react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
}

const NavLink = ({ href, children, icon, active }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
        active 
          ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
          : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
      }`}
    >
      <div className={`transition-colors duration-200 ${active ? "text-blue-400" : "text-slate-400 group-hover:text-slate-600"}`}>
        {icon}
      </div>
      <span className="flex-1">{children}</span>
      {active && (
        <ChevronRight className="w-4 h-4 text-blue-400 animate-in fade-in slide-in-from-left-2" />
      )}
    </Link>
  );
};

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-mesh font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex w-full max-w-[1400px] h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2.5 group transition-opacity hover:opacity-90">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-all">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="hidden text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 sm:block">
                NeoConnect
              </span>
            </Link>
            
            <div className="hidden md:flex items-center relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="block w-64 rounded-full border border-slate-200 py-1.5 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="relative p-2.5 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-100 hidden sm:block">
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {user && (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-3 sm:pl-4">
                 <div className="flex flex-col items-end hidden sm:flex">
                   <span className="text-sm font-bold text-slate-800 leading-tight">
                     {user.name}
                   </span>
                   <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase mt-0.5 bg-blue-50 px-1.5 py-0.5 rounded-sm">
                     {user.role.replace("_", " ")}
                   </span>
                 </div>
                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold text-sm ring-2 ring-white shadow-sm border border-blue-200">
                   {user.name.charAt(0).toUpperCase()}
                 </div>
              </div>
            )}
            
            <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>

            <button
              onClick={handleLogout}
              className="group flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:bg-red-50 hover:text-red-700 hover:border-red-200 hover:shadow-red-500/10 transition-all focus:outline-none"
              title="Log out"
            >
              <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-500 transition-colors" />
              <span className="hidden sm:block">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-[280px] shrink-0 md:block">
          <div className="sticky top-24 rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar premium-border">
            <nav className="space-y-1.5">
              <div className="px-3 pb-3 pt-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400/80">Platform Navigation</p>
              </div>
              <NavLink href="/dashboard" active={pathname === "/dashboard"} icon={<LayoutDashboard size={18} />}>
                Overview
              </NavLink>

              {user?.role === "staff" && (
                <>
                  <div className="px-3 pb-2 pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Staff Tools</p>
                  </div>
                  <NavLink href="/staff/submit" active={pathname === "/staff/submit"} icon={<MessageSquare />}>
                    Submit Complaint
                  </NavLink>
                  <NavLink href="/staff/cases" active={pathname === "/staff/cases"} icon={<FolderOpenDot />}>
                    My Cases
                  </NavLink>
                  <NavLink href="/hub" active={pathname === "/hub"} icon={<Globe2 />}>
                    Public Hub
                  </NavLink>
                  <NavLink href="/polls" active={pathname === "/polls"} icon={<Vote />}>
                    Organizational Polls
                  </NavLink>
                </>
              )}

              {user?.role === "secretariat" && (
                <>
                  <div className="px-3 pb-2 pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Management</p>
                  </div>
                  <NavLink href="/secretariat" active={pathname === "/secretariat"} icon={<ShieldAlert />}>
                    Secretariat Panel
                  </NavLink>
                  <NavLink href="/analytics" active={pathname === "/analytics"} icon={<BarChart3 />}>
                    Insights & Analytics
                  </NavLink>
                  <NavLink href="/polls" active={pathname === "/polls"} icon={<Vote />}>
                    Manage Polls
                  </NavLink>
                  <NavLink href="/hub" active={pathname === "/hub"} icon={<Globe2 />}>
                    Public Hub Docs
                  </NavLink>
                </>
              )}

              {user?.role === "case_manager" && (
                <>
                  <div className="px-3 pb-2 pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Case Actions</p>
                  </div>
                  <NavLink href="/case-manager" active={pathname === "/case-manager"} icon={<FileText />}>
                    Manage Assignments
                  </NavLink>
                </>
              )}

              {user?.role === "admin" && (
                <>
                  <div className="px-3 pb-2 pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">System Admin</p>
                  </div>
                  <NavLink href="/admin" active={pathname === "/admin"} icon={<Settings />}>
                    User Configuration
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1 animate-fade-in relative z-10">
           {/* Add a subtle background shape for dashboard content area */}
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-gradient-to-bl from-blue-50 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none -z-10"></div>
           {children}
        </main>
      </div>
    </div>
  );
}
