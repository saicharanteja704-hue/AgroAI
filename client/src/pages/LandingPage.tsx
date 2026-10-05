import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  ShieldCheck,
  Sparkles,
  Droplets,
  FlaskConical,
  Bug,
  Mountain,
  CloudSun,
  PackageCheck,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Compass,
  Tractor,
  Layers,
} from 'lucide-react';
import { CATEGORIES } from '../components/advisory/CategorySelector';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-16 pb-12 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-tr from-emerald-100/60 to-green-100/40 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto text-center px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-semibold shadow-sm animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI-Powered Precision Agriculture Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Empowering Farmers with <br />
            <span className="bg-gradient-to-r from-emerald-700 via-green-600 to-teal-700 bg-clip-text text-transparent">
              Intelligent Crop Advisories
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Make confident, data-driven decisions on crop selection, balanced fertilizer nutrition, precision irrigation, and pest diagnostics — tailored to your soil, water, and local growth conditions.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to={isAuthenticated ? '/advisory/new' : '/register'}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>{isAuthenticated ? 'Create New Advisory' : 'Start Free Advisory'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-emerald-600 hover:bg-emerald-50/50 text-slate-700 font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>{isAuthenticated ? 'Open Dashboard' : 'Sign In to Account'}</span>
            </Link>
          </div>

          {/* Key Value Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tailored to Your Soil & Water</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Actionable 48h Checklist</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Free & Accessible on Mobile</span>
            </span>
          </div>
        </div>
      </section>

      {/* Advisory Domains Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-emerald-700">
            Agricultural Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            9 Specialized Crop Advisory Domains
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Comprehensive decision-support from pre-sowing soil prep through growth and post-harvest storage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:shadow-md transition-all space-y-3 group hover:border-emerald-300"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.bgColor} ${cat.borderColor} border`}
                  >
                    <Icon className={`w-5 h-5 ${cat.color}`} />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {cat.badge}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-800 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {cat.shortDesc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-emerald-950 text-white py-16 sm:py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              How AgroAI Assists Your Farm
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto leading-relaxed">
              Designed for farmers and extension workers with minimal technical overhead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-900/60 border border-emerald-800/80 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                1
              </div>
              <h3 className="font-bold text-white text-base">Enter Farm & Crop Data</h3>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Provide your location, soil type, irrigation setup, current crop, growth stage, and question or symptoms.
              </p>
            </div>

            <div className="bg-emerald-900/60 border border-emerald-800/80 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                2
              </div>
              <h3 className="font-bold text-white text-base">Gemini Agronomic Analysis</h3>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Google's Gemini model analyzes the parameters against integrated pest management (IPM) guidelines and crop physiology.
              </p>
            </div>

            <div className="bg-emerald-900/60 border border-emerald-800/80 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                3
              </div>
              <h3 className="font-bold text-white text-base">Actionable Checklist</h3>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Receive an immediate 48-hour action checklist, risk warnings, preventive advice, and follow-up schedules.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to={isAuthenticated ? '/advisory/new' : '/register'}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-emerald-950 font-bold text-sm shadow-lg hover:bg-emerald-50 transition-all hover:scale-105"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </Link>
          </div>
        </div>
      </section>

      {/* Safety & Compliance Card */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-amber-700" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              Committed to Agricultural Safety & Field Responsibility
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AgroAI enforces strict safety guardrails. We never prescribe lethal off-label chemical concentrations without adequate parameters. In pest diagnosis without laboratory samples, results are flagged as preliminary assessments and recommend in-person extension review.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
