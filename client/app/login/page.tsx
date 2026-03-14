"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/auth/useAuth";
import { MessageSquare, Mail, Lock, ArrowRight, Activity, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState("staff");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password, role);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50 overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
      <div className="absolute top-0 -right-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-10 left-32 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>

      <div className="z-10 w-[90%] max-w-md animate-fade-in relative shadow-2xl rounded-2xl">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl ring-1 ring-slate-900/5" />
        <div className="relative z-20 p-8 sm:p-12 pb-10">
          <div className="flex justify-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/30">
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
          </div>
          
          <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mb-8 text-center text-sm font-medium text-slate-500">
            Sign in to NeoConnect with your credentials.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5 focus-within:text-blue-600">
              <label className="text-sm font-semibold text-slate-700 transition-colors">
                Select Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3 pl-10 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white/50 backdrop-blur-sm transition-all shadow-sm appearance-none"
                >
                  <option value="staff">Staff</option>
                  <option value="secretariat">Secretariat</option>
                  <option value="case_manager">Case Manager</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Activity className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 focus-within:text-blue-600">
              <label className="text-sm font-semibold text-slate-700 transition-colors">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@neoconnect.demo"
                  required
                  className="block w-full rounded-xl border-0 py-3 pl-10 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white/50 backdrop-blur-sm transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5 focus-within:text-blue-600">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 transition-colors">
                  Password
                </label>
                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="block w-full rounded-xl border-0 py-3 pl-10 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white/50 backdrop-blur-sm transition-all shadow-sm"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 shadow-sm border border-red-100 flex items-start">
                <div className="flex-shrink-0">
                   <Activity className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800" role="alert">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-3.5 text-sm font-semibold leading-6 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
            >
              {loading ? "Signing in..." : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-5 w-5 opacity-70 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-slate-500 font-medium pb-2 border-t border-slate-100 pt-6">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-indigo-500 transition-colors">
              Request access
            </Link>
          </div>
        </div>
      </div>
      
      {/* Demo helper */}
      <div className="absolute bottom-6 z-10 animate-fade-in flex flex-col items-center">
         <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Demo Credentials (password: password123)</p>
         <div className="flex gap-4">
            <span className="text-xs bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full text-slate-600 shadow-sm border border-slate-200/50">staff01@neoconnect.demo</span>
            <span className="text-xs bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full text-slate-600 shadow-sm border border-slate-200/50">admin01@neoconnect.demo</span>
         </div>
      </div>
    </main>
  );
}
