"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { RequireRole } from "../../components/auth/RequireRole";
import { Shield, Mail, Briefcase, Building2, CheckCircle2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
};

export default function AdminPanelPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const res = await axios.get(`${API_BASE}/users`);
      setUsers(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateUser = async (id: string, role: string, department: string) => {
    await axios.patch(`${API_BASE}/users/${id}`, { role, department });
    await load();
  };

  return (
    <RequireRole roles={["admin"]}>
      <DashboardShell>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Configuration</h1>
              <p className="text-sm text-slate-500 mt-1">Manage personnel roles and department assignments across the platform.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900"></div>
                <p className="text-sm font-medium text-slate-500 animate-pulse">Loading directory...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center bg-red-50">
                <p className="text-sm font-semibold text-red-600">{error}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Personnel</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Access Role</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 font-bold border border-slate-200">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{u.name}</p>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3" /> {u.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <select
                              defaultValue={u.role}
                              onChange={(e) => updateUser(u._id, e.target.value, u.department)}
                              className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-8 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm hover:border-slate-300 transition-colors cursor-pointer"
                            >
                              <option value="staff">Staff</option>
                              <option value="secretariat">Secretariat</option>
                              <option value="case_manager">Case Manager</option>
                              <option value="admin">Administrator</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                              defaultValue={u.department}
                              onBlur={(e) => updateUser(u._id, u.role, e.target.value || u.department)}
                              className="w-full min-w-[150px] rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm hover:border-slate-300 transition-colors placeholder:text-slate-400"
                              placeholder="Set department..."
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 border border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Auto-saved
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
    </RequireRole>
  );
}
