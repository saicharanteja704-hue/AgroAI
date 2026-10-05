import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getAdvisoriesApi, toggleFavoriteApi, deleteAdvisoryApi } from '../api/advisory';
import { Advisory, AdvisoryCategory } from '../types';
import { AdvisoryCard } from '../components/advisory/AdvisoryCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { Alert } from '../components/common/Alert';
import { CATEGORIES } from '../components/advisory/CategorySelector';
import {
  History,
  Search,
  Filter,
  Star,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Sprout,
  Trash2,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'all');
  const [search, setSearch] = useState<string>('');
  const [favoriteOnly, setFavoriteOnly] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdvisoriesApi({
        category: category !== 'all' ? category : undefined,
        search: search.trim() || undefined,
        favorite: favoriteOnly,
        page,
        limit: 9,
      });

      if (res.success) {
        setAdvisories(res.advisories);
        setTotalPages(res.pagination.totalPages || 1);
        setTotalCount(res.pagination.total);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch advisory history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [category, favoriteOnly, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await toggleFavoriteApi(id);
      if (res.success) {
        setAdvisories((prev) =>
          prev.map((a) => (a.id === id ? { ...a, is_favorite: res.is_favorite } : a))
        );
      }
    } catch {
      // Ignore network toggle error
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this advisory report from your history?')) {
      return;
    }

    try {
      const res = await deleteAdvisoryApi(id);
      if (res.success) {
        setAdvisories((prev) => prev.filter((a) => a.id !== id));
        setTotalCount((c) => Math.max(0, c - 1));
      }
    } catch (err: any) {
      alert(err.message || 'Could not delete advisory');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-emerald-700 mb-1">
            <History className="w-4 h-4" />
            <span>Advisory Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Advisory History & Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review, search, and manage your previous agricultural advisory plans ({totalCount} total)
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

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by crop, keyword, or query..."
            className="w-full border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-2.5 py-1.5 bg-white text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-medium text-slate-700 focus:outline-none pr-2"
            >
              <option value="all">All Domains (9)</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Bookmarked Filter */}
          <button
            type="button"
            onClick={() => {
              setFavoriteOnly(!favoriteOnly);
              setPage(1);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
              favoriteOnly
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${favoriteOnly ? 'fill-current text-amber-500' : ''}`} />
            <span>Saved Only</span>
          </button>
        </div>
      </div>

      {/* Advisory Cards List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton rows={4} />
          <CardSkeleton rows={4} />
          <CardSkeleton rows={4} />
        </div>
      ) : advisories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {advisories.map((advisory) => (
            <div key={advisory.id} className="relative group">
              <AdvisoryCard
                advisory={advisory}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDelete}
              />
              <button
                onClick={(e) => handleDelete(advisory.id, e)}
                title="Delete Advisory"
                className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-4 right-24 p-1 rounded hover:bg-rose-50 text-slate-300 hover:text-rose-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">No advisories found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {search || category !== 'all' || favoriteOnly
              ? 'No advisory records match your current filter criteria. Try resetting your search or category filter.'
              : 'You have not generated any crop advisory plans yet. Request your first plan to start tracking.'}
          </p>
          <Link
            to="/advisory/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-sm hover:bg-emerald-700"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generate New Advisory</span>
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
