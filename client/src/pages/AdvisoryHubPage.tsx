import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES, CategoryInfo } from '../components/advisory/CategorySelector';
import { AdvisoryCategory } from '../types';
import {
  Compass,
  ArrowRight,
  PlusCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const AdvisoryHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredCategories =
    selectedFilter === 'all'
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.badge.toLowerCase().includes(selectedFilter.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-emerald-700 mb-1">
            <Compass className="w-4 h-4" />
            <span>Advisory Intelligence Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Agricultural Advisory Domains
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Select an agricultural domain below to request tailored agronomic guidance, diagnostic analysis, or seasonal recommendations.
          </p>
        </div>

        <Link
          to="/advisory/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Advisory</span>
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-card hover:shadow-lg transition-all p-6 flex flex-col justify-between group hover:border-emerald-400"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cat.bgColor} ${cat.borderColor} border`}
                  >
                    <Icon className={`w-6 h-6 ${cat.color}`} />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {cat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {cat.shortDesc}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                <Link
                  to={`/history?category=${cat.id}`}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Past Records
                </Link>

                <Link
                  to={`/advisory/new?category=${cat.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  <span>Request Advisory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
