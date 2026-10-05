import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardStatsApi } from '../api/advisory';
import { DashboardStats } from '../types';
import { AdvisoryCard } from '../components/advisory/AdvisoryCard';
import { DashboardStatsSkeleton, CardSkeleton } from '../components/common/LoadingSkeleton';
import { Alert } from '../components/common/Alert';
import {
  Sprout,
  PlusCircle,
  Tractor,
  Layers,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Droplets,
  Bug,
  FlaskConical,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStatsApi();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-800 rounded-3xl text-white p-6 sm:p-8 shadow-card relative overflow-hidden">
        {/* Glow & texture */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold border border-emerald-700/60">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kisan AI Assistant Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Namaste, {user?.name || 'Farmer'}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Your farm intelligence hub is ready. Review recent crop diagnostics, inspect soil profiles, or generate a precision agronomic advisory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/advisory/new"
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Advisory Request</span>
            </Link>

            <Link
              to="/farm"
              className="px-4 py-3 rounded-xl bg-emerald-950/70 border border-emerald-700/70 hover:bg-emerald-900 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors"
            >
              <Tractor className="w-4 h-4 text-emerald-400" />
              <span>Manage Farms</span>
            </Link>
          </div>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Metrics Row */}
      {loading ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Total Advisories</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {stats?.totalAdvisories ?? 0}
              </h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">
                Precision agronomic plans
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Registered Farms</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {stats?.farms?.length ?? 0}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Active land parcels
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Tractor className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Active Crops</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {stats?.farms?.filter((f) => f.current_crop).length ||
                  (stats?.recentAdvisories?.length ? 1 : 0)}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Under advisory care
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
              <Sprout className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Advisory Language</p>
              <h3 className="text-xl font-bold text-slate-900">
                {user?.preferred_language || 'English'}
              </h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">
                Localized AI response
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Quick Category Action Shortcuts */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>Quick Advisory Launchers</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <Link
            to="/advisory/new?category=pest_disease"
            className="p-4 rounded-2xl bg-white border border-rose-200 hover:border-rose-400 hover:bg-rose-50/50 transition-all flex flex-col items-start gap-2 shadow-sm group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Pest & Disease</h4>
              <p className="text-[11px] text-slate-500">Symptom check & IPM</p>
            </div>
          </Link>

          <Link
            to="/advisory/new?category=fertilizer"
            className="p-4 rounded-2xl bg-white border border-purple-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all flex flex-col items-start gap-2 shadow-sm group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Fertilizer Doses</h4>
              <p className="text-[11px] text-slate-500">NPK & soil nutrition</p>
            </div>
          </Link>

          <Link
            to="/advisory/new?category=irrigation"
            className="p-4 rounded-2xl bg-white border border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50/50 transition-all flex flex-col items-start gap-2 shadow-sm group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Irrigation Timing</h4>
              <p className="text-[11px] text-slate-500">Water schedule</p>
            </div>
          </Link>

          <Link
            to="/advisory/new?category=crop_selection"
            className="p-4 rounded-2xl bg-white border border-amber-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all flex flex-col items-start gap-2 shadow-sm group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Crop Selection</h4>
              <p className="text-[11px] text-slate-500">Season & soil suitability</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content Grid: Recent Advisories + Farm Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Advisories (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Recent Advisory Plans</span>
              {stats?.recentAdvisories?.length ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  {stats.recentAdvisories.length}
                </span>
              ) : null}
            </h2>
            <Link
              to="/history"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : stats?.recentAdvisories && stats.recentAdvisories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.recentAdvisories.map((advisory) => (
                <AdvisoryCard key={advisory.id} advisory={advisory} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No advisories generated yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Provide your farm location, soil type, and target crop to receive your first structured agronomic action plan.
              </p>
              <Link
                to="/advisory/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-sm hover:bg-emerald-700"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create First Advisory</span>
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Farmer & Farm Summary + Seasonal Alert */}
        <div className="space-y-6">
          {/* Active Farm Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Tractor className="w-4 h-4 text-emerald-600" />
                <span>Farm Information</span>
              </h3>
              <Link
                to="/farm"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Manage
              </Link>
            </div>

            {stats?.farms && stats.farms.length > 0 ? (
              <div className="space-y-3">
                {stats.farms.slice(0, 2).map((farm) => (
                  <div
                    key={farm.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{farm.farm_name}</span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        {farm.farm_size} {farm.land_unit}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {farm.location}, {farm.district || farm.state}
                    </p>
                    <div className="text-[11px] text-slate-600 flex items-center gap-2 pt-1">
                      <span>Soil: <strong>{farm.soil_type}</strong></span>
                      {farm.current_crop && (
                        <span>• Crop: <strong>{farm.current_crop}</strong></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-slate-500">No farm registered yet.</p>
                <Link
                  to="/farm"
                  className="text-xs font-semibold text-emerald-700 hover:underline"
                >
                  + Add your farm details
                </Link>
              </div>
            )}
          </div>

          {/* Important Agronomic Advisory Alert */}
          <div className="bg-amber-50/70 rounded-2xl border border-amber-200/90 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Seasonal Advisory Notice</span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Always inspect soil moisture before morning irrigation. For pest infestations exceeding 10% of foliage, apply neem-based biopesticides before considering chemical interventions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
