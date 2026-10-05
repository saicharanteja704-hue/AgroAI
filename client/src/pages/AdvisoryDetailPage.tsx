import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdvisoryByIdApi, toggleFavoriteApi } from '../api/advisory';
import { Advisory } from '../types';
import { AdvisoryResultView } from '../components/advisory/AdvisoryResultView';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { Alert } from '../components/common/Alert';
import { ArrowLeft, Sprout } from 'lucide-react';

export const AdvisoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [advisory, setAdvisory] = useState<Advisory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvisory = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getAdvisoryByIdApi(id);
      if (res.success && res.advisory) {
        setAdvisory(res.advisory);
      } else {
        throw new Error('Advisory record not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load advisory report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisory();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!id) return;
    try {
      const res = await toggleFavoriteApi(id);
      if (res.success && advisory) {
        setAdvisory({ ...advisory, is_favorite: res.is_favorite });
      }
    } catch {
      // Ignore favorite toggle network error
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <CardSkeleton rows={5} />
        <CardSkeleton rows={4} />
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <Alert type="error" message={error || 'Advisory plan not found'} />
        <Link
          to="/history"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-sm hover:bg-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Advisory Archive</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <AdvisoryResultView
        advisory={advisory}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={advisory.is_favorite}
      />
    </div>
  );
};
