import React from 'react';
import { Link } from 'react-router-dom';
import { Advisory } from '../../types';
import { Badge } from '../common/Badge';
import { CATEGORIES } from './CategorySelector';
import {
  Calendar,
  Layers,
  ArrowRight,
  Star,
  Sprout,
  ShieldAlert,
} from 'lucide-react';
import { format } from 'date-fns';

interface AdvisoryCardProps {
  advisory: Advisory;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
}

export const AdvisoryCard: React.FC<AdvisoryCardProps> = ({
  advisory,
  onToggleFavorite,
  onDelete,
}) => {
  const categoryInfo = CATEGORIES.find((c) => c.id === advisory.category) || CATEGORIES[0];
  const Icon = categoryInfo.icon;

  let formattedDate = 'Recently';
  try {
    formattedDate = format(new Date(advisory.created_at), 'MMM dd, yyyy');
  } catch {
    formattedDate = 'Recently';
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-md transition-all p-5 flex flex-col justify-between group hover:border-emerald-300">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryInfo.bgColor} ${categoryInfo.borderColor} ${categoryInfo.color}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{categoryInfo.title}</span>
            </span>

            <Badge variant="confidence" confidenceValue={advisory.confidence_level}>
              {advisory.confidence_level}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => onToggleFavorite(advisory.id, e)}
                className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                  advisory.is_favorite ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'
                }`}
                title={advisory.is_favorite ? 'Remove Bookmark' : 'Bookmark Advisory'}
                aria-label="Bookmark"
              >
                <Star className={`w-4 h-4 ${advisory.is_favorite ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Crop & Growth Stage */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-700 mb-2">
          <span className="flex items-center gap-1 text-emerald-800 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            {advisory.crop || 'General Guidance'}
          </span>
          {advisory.crop_stage && (
            <span className="text-slate-500 text-xs truncate">
              • {advisory.crop_stage}
            </span>
          )}
        </div>

        {/* Short Summary */}
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {advisory.summary || advisory.recommendation}
        </p>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>

        <Link
          to={`/advisory/${advisory.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
