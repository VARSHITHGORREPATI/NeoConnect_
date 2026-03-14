"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DashboardShell } from "../../../components/layout/DashboardShell";
import { useAuth } from "../../../components/auth/useAuth";
import { MessageSquarePlus, Send, AlertCircle, FileText, CheckCircle2, ShieldQuestion } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

export default function SubmitComplaintPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    category: "Safety",
    department: user?.department || "",
    location: "",
    severity: "Low",
    description: "",
    anonymous: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) =>
        data.append(k, typeof v === "boolean" ? String(v) : v)
      );
      if (file) data.append("file", file);
      const res = await axios.post(`${API_BASE}/cases`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({ text: `Submitted successfully. Tracking ID: ${res.data.trackingId}`, type: 'success' });
      setForm({
        category: "Safety",
        department: user?.department || "",
        location: "",
        severity: "Low",
        description: "",
        anonymous: false,
      });
      setFile(null);
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => setMessage(null), 8000);
    } catch (err: any) {
      setMessage({ text: err?.response?.data?.message || "Submission failed. Please try again.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <MessageSquarePlus className="h-6 w-6 text-blue-600" /> Lodge a Case or Complaint
          </h1>
          <p className="text-sm text-slate-500 mt-1">Submit feedback securely. You may choose to stay completely anonymous.</p>
        </div>

        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="text-sm font-semibold">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Context Section */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Categorization & Context</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Topic Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
                  >
                    <option>Safety</option>
                    <option>Policy</option>
                    <option>Facilities</option>
                    <option>HR</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Applies to Department</label>
                  <input
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner placeholder:text-slate-400"
                    placeholder="e.g. Sales, HR, Engineering"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Specific Location / Office</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner placeholder:text-slate-400"
                    placeholder="e.g. Building A, Floor 3"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    Impact Severity <ShieldQuestion className="h-4 w-4 text-slate-400"/>
                  </label>
                  <select
                    value={form.severity}
                    onChange={(e) => setForm({ ...form, severity: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
                  >
                    <option value="Low">Low - Minor issue or feedback</option>
                    <option value="Medium">Medium - Moderate impact</option>
                    <option value="High">High - Critical or urgent safety</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Complaint Details</h3>
              <div className="space-y-6">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Detailed Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={5}
                    placeholder="Provide as much verifiable detail as possible..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner resize-y placeholder:text-slate-400"
                    required
                  />
                </div>
                
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 border-dashed">
                  <label className="mb-1 block text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" /> Evidence / Attachment
                  </label>
                  <p className="text-xs text-slate-500 mb-3 block">Supported formats: JPG, PNG, PDF (max 5MB)</p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Footer / Submit area */}
          <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={form.anonymous}
                  onChange={(e) => setForm({ ...form, anonymous: e.target.checked })}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 bg-white transition-all checked:border-blue-600 checked:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-600"
                />
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <div>
                <span className="text-base font-bold text-slate-800 block group-hover:text-blue-700 transition-colors">Submit Anonymously</span>
                <span className="text-xs font-medium text-slate-500 block">Your identity will remain completely hidden.</span>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-70 disabled:pointer-events-none disabled:transform-none"
            >
              {loading ? (
                 <>
                   <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                   Processing...
                 </>
              ) : (
                <>Submit Case <Send className="w-4 h-4 ml-1" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
