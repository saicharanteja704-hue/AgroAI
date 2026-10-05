import React, { useState } from 'react';
import { Advisory } from '../../types';
import { Badge } from '../common/Badge';
import { CATEGORIES } from './CategorySelector';
import {
  Sparkles,
  Sprout,
  CheckSquare,
  Square,
  ShieldAlert,
  AlertTriangle,
  Lightbulb,
  Clock,
  UserCheck,
  Printer,
  Share2,
  Calendar,
  Layers,
  MapPin,
  Bookmark,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface AdvisoryResultViewProps {
  advisory: Advisory;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export const AdvisoryResultView: React.FC<AdvisoryResultViewProps> = ({
  advisory,
  onToggleFavorite,
  isFavorite = advisory.is_favorite,
}) => {
  const [completedActions, setCompletedActions] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const toggleAction = (index: number) => {
    setCompletedActions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `AgroAI Advisory: ${advisory.crop || 'Crop'} - ${advisory.category}`,
        text: advisory.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const categoryInfo =
    CATEGORIES.find((c) => c.id === advisory.category) || CATEGORIES[0];
  const CategoryIcon = categoryInfo.icon;

  let formattedDate = 'Recently';
  try {
    formattedDate = format(new Date(advisory.created_at), 'MMMM dd, yyyy');
  } catch {
    formattedDate = 'Recently';
  }

  // Parse arrays safely if returned as string from DB
  const parseList = (item: any): string[] => {
    if (Array.isArray(item)) return item;
    if (typeof item === 'string') {
      try {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [item];
      }
    }
    return [];
  };

  const immediateActions = parseList(advisory.immediate_actions);
  const recommendedPractices = parseList(advisory.recommended_practices);
  const risks = parseList(advisory.risks);
  const preventiveMeasures = parseList(advisory.preventive_measures);
  const warnings = parseList(advisory.warnings);
  const followUpActions = parseList(advisory.follow_up_actions);
  const expertTriggers = parseList(advisory.expert_consultation_triggers);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Action Bar */}
      <div className="no-print flex items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Advisory Archive</span>
        </Link>

        <div className="flex items-center gap-2">
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isFavorite
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current text-amber-500' : ''}`} />
              <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Advisory Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -z-0 opacity-60 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${categoryInfo.bgColor} ${categoryInfo.borderColor} ${categoryInfo.color}`}
              >
                <CategoryIcon className="w-4 h-4" />
                <span>{categoryInfo.title}</span>
              </span>

              <Badge variant="confidence" confidenceValue={advisory.confidence_level}>
                Confidence: {advisory.confidence_level}
              </Badge>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {advisory.crop ? `${advisory.crop} Crop Advisory` : 'Agricultural Advisory Plan'}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
              {advisory.crop_stage && (
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  Stage: <strong>{advisory.crop_stage}</strong>
                </span>
              )}
              {advisory.farm_name && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Farm: <strong>{advisory.farm_name}</strong>
                </span>
              )}
            </p>
          </div>

          {/* Question Callout */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 leading-relaxed italic">
            <span className="font-semibold text-slate-900 not-italic block mb-0.5">Farmer Query:</span>
            "{advisory.question}"
          </div>

          {/* Executive Summary Banner */}
          <div className="bg-gradient-to-r from-emerald-900 to-green-800 text-white rounded-2xl p-5 sm:p-6 shadow-md">
            <div className="flex items-center gap-2 text-emerald-300 text-xs uppercase tracking-wider font-bold mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Executive Advisory Summary</span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-emerald-50 font-medium">
              {advisory.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Recommendation & Reasoning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recommendation */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-3">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Primary Recommendation</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {advisory.recommendation}
            </p>
          </div>
        </div>

        {/* Scientific Reasoning */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Agronomic Science & Reasoning</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {advisory.reasoning}
            </p>
          </div>
        </div>
      </div>

      {/* Immediate Actions Checklist (Interactive) */}
      {immediateActions.length > 0 && (
        <div className="bg-white rounded-2xl border border-emerald-200/90 p-5 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Immediate Actions (Today & Next 48 Hours)</span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {completedActions.length}/{immediateActions.length} Done
            </span>
          </div>

          <div className="space-y-2.5">
            {immediateActions.map((action, idx) => {
              const isDone = completedActions.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleAction(idx)}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 cursor-pointer transition-all ${
                    isDone
                      ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                      : 'bg-emerald-50/40 border-emerald-100 text-slate-800 hover:bg-emerald-50/70 font-medium'
                  }`}
                >
                  <button type="button" className="mt-0.5 shrink-0 text-emerald-600">
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <span className="leading-relaxed">{action}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Practices & Preventive Measures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recommended Practices */}
        {recommendedPractices.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm mb-3.5 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Recommended Agronomic Practices</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {recommendedPractices.map((practice, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span className="leading-relaxed">{practice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Preventive Measures */}
        {preventiveMeasures.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm mb-3.5 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-600" />
              <span>Preventive Measures for Future Cycles</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {preventiveMeasures.map((measure, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                  <span className="leading-relaxed">{measure}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Risks & Operational Warnings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Potential Risks */}
        {risks.length > 0 && (
          <div className="bg-amber-50/60 rounded-2xl border border-amber-200 p-5 sm:p-6">
            <h4 className="font-bold text-amber-950 text-sm mb-3.5 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Identified Agricultural Risks</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-amber-900">
              {risks.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span className="leading-relaxed">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="bg-rose-50/60 rounded-2xl border border-rose-200 p-5 sm:p-6">
            <h4 className="font-bold text-rose-950 text-sm mb-3.5 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Safety & Application Warnings</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-rose-900">
              {warnings.map((warn, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span className="leading-relaxed font-medium">{warn}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Follow-up Actions */}
      {followUpActions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <h4 className="font-bold text-slate-900 text-sm mb-3.5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Follow-Up Monitoring Schedule (3 - 7 Days)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {followUpActions.map((fAction, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{fAction}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* When to Consult an Agricultural Extension Officer */}
      {expertTriggers.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-5 sm:p-6">
          <div className="flex items-center gap-2.5 text-blue-950 font-bold text-sm mb-2">
            <UserCheck className="w-5 h-5 text-blue-700" />
            <span>When to Involve Your Local Agronomist / Extension Officer</span>
          </div>
          <p className="text-xs text-blue-800 mb-3">
            If you observe any of the following threshold triggers, visit your local Krishi Vigyan Kendra (KVK) or contact an extension specialist immediately:
          </p>
          <ul className="space-y-1.5 text-xs text-blue-900 font-medium">
            {expertTriggers.map((trigger, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span className="leading-relaxed">{trigger}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Statutory Footer Callout */}
      <div className="text-center py-4 border-t border-slate-200 text-xs text-slate-400">
        Report Generated by AgroAI Assistant • All recommendations are advisory and decision-support only.
      </div>
    </div>
  );
};
