import React from 'react';

export const CardSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-slate-200 rounded w-1/3"></div>
        <div className="h-6 bg-slate-200 rounded-full w-20"></div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-slate-100 rounded"
            style={{ width: `${85 - i * 15}%` }}
          ></div>
        ))}
      </div>
      <div className="pt-2 flex items-center gap-2">
        <div className="h-8 bg-slate-200 rounded-lg w-24"></div>
        <div className="h-8 bg-slate-100 rounded-lg w-16"></div>
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="w-8 h-8 bg-slate-200 rounded-xl"></div>
          </div>
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-3 bg-slate-100 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
};
