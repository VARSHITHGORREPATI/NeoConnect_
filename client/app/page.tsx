"use client";

import Link from "next/link";
import { ArrowRight, MessageSquare, ShieldCheck, Activity } from "lucide-react";
import { useAuth } from "../components/auth/useAuth";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  
  const targetHref = user ? "/dashboard" : "/login";
  const headerText = user ? "Go to Dashboard →" : "Sign in →";

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 selection:bg-blue-100 text-slate-900">
      {/* Background decorations */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-6 sm:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            NeoConnect
          </span>
        </div>
        {!isLoading && (
          <Link
            href={targetHref}
            className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
          >
            {headerText}
          </Link>
        )}
      </header>

      {/* Hero Content */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center sm:px-12 animate-fade-in">
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/50 px-3 py-1 text-sm font-medium text-blue-800 backdrop-blur-md mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
          Internal Enterprise Platform
        </div>
        
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 text-slate-900">
          Staff feedback, <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            elevated.
          </span>
        </h1>
        
        <p className="max-w-2xl text-lg text-slate-600 mb-10 sm:text-xl leading-relaxed">
          The ultimate internal platform for NeoConnect staff. Submit complaints, track resolutions, participate in organizational polls, and access health analytics all in one secure, transparent hub.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href={targetHref}
            className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            {user ? "Go to Dashboard" : "Get Started"}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-all hover:scale-105"
          >
            Learn more
          </a>
        </div>
      </section>

      {/* Features snippet */}
      <section id="features" className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20 pt-10 grid gap-8 sm:grid-cols-3">
        {[
          { icon: MessageSquare, title: "Seamless Feedback", desc: "Submit and track complaints or feedback transparently." },
          { icon: Activity, title: "Clear Analytics", desc: "Interactive charts and dashboards to monitor progress." },
          { icon: ShieldCheck, title: "Secure & Verified", desc: "Role-based access keeping staff information safe." }
        ].map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/60 glass shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-slate-600 text-sm">{feature.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
