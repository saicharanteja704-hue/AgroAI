import React from 'react';
import { AdvisoryCategory } from '../../types';
import {
  Sparkles,
  Sprout,
  Droplets,
  FlaskConical,
  Bug,
  Mountain,
  CloudSun,
  PackageCheck,
  HelpCircle,
} from 'lucide-react';

export interface CategoryInfo {
  id: AdvisoryCategory;
  title: string;
  shortDesc: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  badge: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'crop_selection',
    title: 'Crop Selection',
    shortDesc: 'Match optimal crops to your soil type, season, and water availability.',
    icon: Sparkles,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50/70 hover:bg-amber-100/60',
    borderColor: 'border-amber-200',
    badge: 'Planning',
  },
  {
    id: 'crop_management',
    title: 'Crop Management',
    shortDesc: 'Growth-stage practices, canopy spacing, weeding, and crop vigor.',
    icon: Sprout,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50/70 hover:bg-emerald-100/60',
    borderColor: 'border-emerald-200',
    badge: 'Cultivation',
  },
  {
    id: 'irrigation',
    title: 'Irrigation & Water',
    shortDesc: 'Moisture scheduling, drip volume, drought defense, and flood drainage.',
    icon: Droplets,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50/70 hover:bg-cyan-100/60',
    borderColor: 'border-cyan-200',
    badge: 'Water Care',
  },
  {
    id: 'fertilizer',
    title: 'Fertilizer & Nutrition',
    shortDesc: 'Balanced NPK dosage, micronutrient chlorosis fix, and bio-manures.',
    icon: FlaskConical,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50/70 hover:bg-purple-100/60',
    borderColor: 'border-purple-200',
    badge: 'Soil Nutrition',
  },
  {
    id: 'pest_disease',
    title: 'Pest & Disease IPM',
    shortDesc: 'Symptom diagnostics, bio-controls, sticky traps, and safety protocols.',
    icon: Bug,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50/70 hover:bg-rose-100/60',
    borderColor: 'border-rose-200',
    badge: 'Crop Defense',
  },
  {
    id: 'soil',
    title: 'Soil Health',
    shortDesc: 'pH correction, organic carbon enrichment, and salinity management.',
    icon: Mountain,
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50/70 hover:bg-yellow-100/60',
    borderColor: 'border-yellow-200',
    badge: 'Earth Health',
  },
  {
    id: 'weather',
    title: 'Weather Precautions',
    shortDesc: 'Heat stress relief, unseasonal rain precautions, and frost defenses.',
    icon: CloudSun,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50/70 hover:bg-blue-100/60',
    borderColor: 'border-blue-200',
    badge: 'Climate Buffer',
  },
  {
    id: 'harvest',
    title: 'Harvest & Storage',
    shortDesc: 'Maturity indicators, safe grain moisture levels, and warehouse storage.',
    icon: PackageCheck,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50/70 hover:bg-orange-100/60',
    borderColor: 'border-orange-200',
    badge: 'Post-Harvest',
  },
  {
    id: 'general',
    title: 'General Agriculture',
    shortDesc: 'Crop rotation science, intercropping, and sustainable farming questions.',
    icon: HelpCircle,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50/70 hover:bg-teal-100/60',
    borderColor: 'border-teal-200',
    badge: 'Knowledge',
  },
];

interface CategorySelectorProps {
  selectedCategory: AdvisoryCategory;
  onSelectCategory: (category: AdvisoryCategory) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group flex items-start gap-3.5 ${
              isSelected
                ? 'bg-white border-emerald-600 shadow-elevated ring-2 ring-emerald-500/30'
                : `${cat.bgColor} ${cat.borderColor} hover:shadow-sm`
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                isSelected ? 'bg-emerald-600 text-white shadow-md' : 'bg-white shadow-sm'
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : cat.color}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <h4
                  className={`font-semibold text-sm truncate ${
                    isSelected ? 'text-emerald-950 font-bold' : 'text-slate-900'
                  }`}
                >
                  {cat.title}
                </h4>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200/80 text-slate-600">
                  {cat.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {cat.shortDesc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
