"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { useAuthContext } from "../../components/auth/AuthProvider";
import { Vote, PlusCircle, CheckCircle2, ChevronRight, X, PieChart, Users } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

type Poll = {
  _id: string;
  question: string;
  options: { label: string; votes: number }[];
  votes: { user: string; optionIndex: number }[];
};

export default function PollsPage() {
  const { user } = useAuthContext();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Poll creation state
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);
  const [creating, setCreating] = useState(false);
  const [showCreator, setShowCreator] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_BASE}/polls`);
        setPolls(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleVote = async (pollId: string) => {
    const optionIndex = selected[pollId];
    if (optionIndex === undefined) return;
    try {
      await axios.post(`${API_BASE}/polls/${pollId}/vote`, { optionIndex });
      const res = await axios.get(`${API_BASE}/polls`);
      setPolls(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to vote");
    }
  };

  const handleCreateOptionsChange = (index: number, value: string) => {
    const newOpts = [...newOptions];
    newOpts[index] = value;
    setNewOptions(newOpts);
  };

  const handleAddOption = () => {
    setNewOptions([...newOptions, ""]);
  };

  const handleRemoveOption = (index: number) => {
    setNewOptions(newOptions.filter((_, i) => i !== index));
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    const filteredOptions = newOptions.filter((o) => o.trim() !== "");
    if (!newQuestion.trim() || filteredOptions.length < 2) {
      alert("Please provide a question and at least 2 options.");
      return;
    }
    setCreating(true);
    try {
      await axios.post(`${API_BASE}/polls`, {
        question: newQuestion,
        options: filteredOptions,
      });
      setNewQuestion("");
      setNewOptions(["", ""]);
      setShowCreator(false);
      const res = await axios.get(`${API_BASE}/polls`);
      setPolls(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create poll");
    } finally {
      setCreating(false);
    }
  };

  const canCreatePoll = user?.role === "secretariat" || user?.role === "admin";
  const calculateTotalVotes = (options: { votes: number }[]) => options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Vote className="h-6 w-6 text-indigo-600" /> Organizational Polls
            </h1>
            <p className="text-sm text-slate-500 mt-1">Participate in shaping company decisions safely and anonymously.</p>
          </div>
          {canCreatePoll && !showCreator && (
            <button
               onClick={() => setShowCreator(true)}
               className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-sm font-semibold transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              <PlusCircle className="w-4 h-4" /> New Form
            </button>
          )}
        </div>

        {canCreatePoll && showCreator && (
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white p-6 sm:p-8 shadow-sm mb-6 relative animate-fade-in">
            <button 
              onClick={() => setShowCreator(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="mb-6 text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-500" /> Compose New Poll
            </h2>
            <form onSubmit={handleCreatePoll} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Inquiry Question</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm placeholder:text-slate-400"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. What should be the theme for the upcoming health week?"
                  required
                />
              </div>
              <div className="relative border-l-2 border-indigo-100 pl-4 ml-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Available Options</label>
                <div className="space-y-3">
                  {newOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 shrink-0 rounded-full border-2 border-slate-200 flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                      </div>
                      <input
                        type="text"
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm placeholder:text-slate-400"
                        value={opt}
                        onChange={(e) => handleCreateOptionsChange(i, e.target.value)}
                        placeholder={`Option ${i + 1}`}
                        required={i < 2}
                      />
                      {newOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(i)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove option"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Append Choice
                </button>
              </div>
              <div className="pt-4 flex justify-end border-t border-slate-100">
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all disabled:opacity-70 disabled:pointer-events-none focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
                >
                  {creating ? (
                    <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div> Publishing...</>
                  ) : (
                     "Publish Poll"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center space-y-3 rounded-2xl border border-slate-200 bg-white">
             <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900"></div>
             <p className="text-sm font-medium text-slate-500 animate-pulse">Loading active polls...</p>
          </div>
        ) : polls.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center space-y-4 rounded-2xl border border-slate-200 bg-white border-dashed">
            <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
              <PieChart className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="font-bold text-lg text-slate-900">No Active Polls</p>
              <p className="text-sm font-medium text-slate-500 mt-1">Check back later when management publishes new surveys.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {polls.map((p) => {
              const hasVoted = p.votes && p.votes.some((v) => v.user === user?.id);
              const totalVotes = calculateTotalVotes(p.options);

              return (
                <div key={p._id} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md relative overflow-hidden group">
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight pr-12">{p.question}</h3>
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500">
                      <Users className="w-3.5 h-3.5" /> {totalVotes} Responses
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {p.options.map((o, idx) => {
                      const isSelected = selected[p._id] === idx;
                      const percentage = totalVotes > 0 ? Math.round((o.votes / totalVotes) * 100) : 0;
                      
                      return (
                        <label
                          key={idx}
                          className={`relative flex flex-col overflow-hidden rounded-xl border p-4 transition-all ${
                            hasVoted 
                              ? "border-slate-100 bg-slate-50 cursor-default" 
                              : isSelected
                                ? "border-blue-500 bg-blue-50/30 cursor-pointer shadow-[0_0_0_1px_rgba(59,130,246,1)]"
                                : "border-slate-200 bg-white cursor-pointer hover:border-blue-300 hover:bg-slate-50"
                          }`}
                        >
                          {/* Progress bar background for results (if voted) */}
                          {hasVoted && (
                            <div 
                              className="absolute inset-y-0 left-0 bg-blue-100/50 transition-all duration-1000 ease-out" 
                              style={{ width: `${percentage}%` }}
                            />
                          )}

                          <div className="relative z-10 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              {!hasVoted && (
                                <div className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-blue-600' : 'border-slate-300'}`}>
                                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>}
                                </div>
                              )}
                              <span className={`text-sm tracking-wide ${hasVoted ? 'font-semibold text-slate-800' : isSelected ? 'font-bold text-blue-900' : 'font-medium text-slate-700'}`}>
                                {o.label}
                              </span>
                            </div>
                            
                            {hasVoted && (
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{o.votes} {o.votes === 1 ? 'vote' : 'votes'}</span>
                                <span className="text-sm font-black text-slate-900 w-10 text-right">{percentage}%</span>
                              </div>
                            )}
                          </div>

                          {/* Invisible radio input */}
                          {!hasVoted && (
                            <input
                              type="radio"
                              name={p._id}
                              className="sr-only"
                              checked={isSelected}
                              onChange={() => setSelected((prev) => ({ ...prev, [p._id]: idx }))}
                            />
                          )}
                        </label>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                     <span className="sm:hidden text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{totalVotes} Responses</span>
                     
                     {hasVoted ? (
                       <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl ml-auto">
                         <CheckCircle2 className="h-5 w-5" /> Recorded
                       </div>
                     ) : (
                       <button
                         onClick={() => handleVote(p._id)}
                         disabled={selected[p._id] === undefined}
                         className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none ml-auto"
                       >
                         Lock in Vote <ChevronRight className="w-4 h-4" />
                       </button>
                     )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
