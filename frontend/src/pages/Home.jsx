import React from 'react';
import { Link } from 'react-router-dom';

import {
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Building2,
  CheckCircle2,
  FileText,
  Award,
  ChevronRight,
  Search,
  UserCheck
} from 'lucide-react';

export default function Home() {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  let user = null;
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      user = null;
    }
  }

  const isCompany = user?.type === 'Company';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        {/* ===================== HERO SECTION ===================== */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8">
          {/* Subtle Background Glow Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden -z-10">
            <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl opacity-70 animate-pulse" />
            <div className="absolute -top-20 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl opacity-60" />
            <div className="absolute top-20 left-1/3 w-80 h-80 bg-indigo-300/15 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
              <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent uppercase tracking-wider">
                Next-Gen AI Hiring & Career Portal
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              Find your next role with{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                intelligent AI evaluations.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              JobNest connects high-caliber talent with verified companies. Apply in seconds,
              complete automated AI pre-screening, and receive instant KPI feedback on your performance.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/jobs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition active:scale-[0.98] cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Explore Open Jobs</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>

              {token ? (
                <Link
                  to={isCompany ? '/dashboard' : '/profile'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-sm rounded-xl shadow-xs transition active:scale-[0.98] cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-slate-500" />
                  <span>{isCompany ? 'Company Dashboard' : 'View Profile & Status'}</span>
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-sm rounded-xl shadow-xs transition active:scale-[0.98] cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>Hire or Register</span>
                </Link>
              )}
            </div>

            {/* Quick Feature Metric Pills */}
            <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">AI Assessment</p>
                  <p className="text-[11px] text-slate-400">Real-time KPI scoring</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Verified Companies</p>
                  <p className="text-[11px] text-slate-400">100% vetted listings</p>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 justify-center sm:justify-start">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Fast Decision</p>
                  <p className="text-[11px] text-slate-400">Automated status update</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== BENTO GRID SECTION ===================== */}
        <section className="py-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Engineered For Modern Hiring
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Everything you need in one place.
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Designed with precision, transparency, and speed for both job seekers and hiring managers.
            </p>
          </div>

          {/* BENTO GRID CONTAINER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Bento Card 1: Large Featured (Col Span 2) - AI Pre-Screening */}
            <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/10 via-purple-500/5 to-transparent rounded-full pointer-events-none -mr-16 -mt-16" />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Proprietary AI Feature
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Automated AI Pre-Screening & Instant Assessment
                </h3>
                <p className="text-sm text-slate-600 max-w-lg leading-relaxed mb-6">
                  Apply to any position and receive customized technical and behavioral interview questions
                  derived directly from the job requirements. Submit answers and receive a detailed KPI breakdown
                  on communication, depth, and overall suitability.
                </p>

                {/* Mock Assessment Preview UI */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:p-5 max-w-xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-blue-600" /> Technical Assessment Score
                    </span>
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      90/100 • Selected
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full w-[90%] rounded-full" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Communication: 8/10
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> Technical Depth: 9/10
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Automated evaluation powered by Groq</span>
                <Link
                  to="/jobs"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  Try an application <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Bento Card 2: 1 Col - Instant Application Status */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Real-Time Application Status
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  No more waiting in the dark. Your dashboard and profile reflect your status
                  (Applied, Selected, or Rejected) automatically based on employer decisions and AI scores.
                </p>

                {/* Status Badges Preview */}
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="font-medium text-slate-700">Senior React Engineer</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Selected
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1 border-t border-slate-200/60">
                    <span className="font-medium text-slate-700">Node.js Developer</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Applied
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  to="/profile"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                >
                  View your candidate profile <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Bento Card 3: 1 Col - One-Click Apply with Cloud Resumes */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Frictionless Cloud Apply
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Keep your resume URL or Google Drive portfolio saved on your profile. Apply to verified openings
                  with a single confirmation click.
                </p>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-blue-600 shadow-xs border border-slate-100">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800">Resume / Portfolio</p>
                    <p className="text-[10px] text-slate-400 truncate">Synced with profile</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400">Zero duplicate uploads</span>
              </div>
            </div>

            {/* Bento Card 4: Col Span 2 - For Employers & Organizations */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-2 bg-white/10 rounded-xl">
                    <Building2 className="w-5 h-5 text-purple-300" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    For Companies & Employers
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  Accelerate Candidate Screening & Team Building
                </h3>
                <p className="text-sm text-slate-300 max-w-lg leading-relaxed mb-6">
                  Post high-priority openings in minutes. Let JobNest evaluate candidate submissions with tailored AI
                  interviews so you only spend time on shortlisted, high-match applicants.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                    <p className="text-lg font-extrabold text-white">70%</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Shorter screening cycle</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                    <p className="text-lg font-extrabold text-white">100%</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Objective rubric scoring</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                    <p className="text-lg font-extrabold text-white">Live</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Applicant management</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">Employer dashboard with full applicant metrics</span>
                <Link
                  to="/dashboard"
                  className="text-xs font-semibold text-purple-300 hover:text-white inline-flex items-center gap-1 transition"
                >
                  Manage openings <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ===================== BOTTOM CTA BANNER ===================== */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-lg shadow-indigo-500/15 relative overflow-hidden">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Ready to take the next step in your career?
            </h2>
            <p className="text-sm text-blue-100 max-w-md mx-auto mt-2">
              Browse hundreds of verified roles, test your skills with AI interview evaluations, and get hired faster.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/jobs"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-blue-700 font-semibold text-sm rounded-xl shadow-sm transition active:scale-[0.98] cursor-pointer"
              >
                Browse All Jobs
              </Link>
              <Link
                to="/auth"
                className="px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-medium text-sm rounded-xl transition cursor-pointer"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-slate-200/80 bg-white py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              JobNest
            </span>
            <span>• Intelligent Career Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/jobs" className="hover:text-blue-600 transition">
              Find Jobs
            </Link>
            <Link to="/profile" className="hover:text-blue-600 transition">
              Profile
            </Link>
            <Link to="/dashboard" className="hover:text-blue-600 transition">
              Employers
            </Link>
            <Link to="/auth" className="hover:text-blue-600 transition">
              Sign In
            </Link>
          </div>
          <p>© {new Date().getFullYear()} JobNest, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
