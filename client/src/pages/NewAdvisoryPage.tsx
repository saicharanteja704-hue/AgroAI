import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AdvisoryCategory, AdvisoryRequest, Farm } from '../types';
import { CategorySelector } from '../components/advisory/CategorySelector';
import { DynamicAdvisoryForm } from '../components/advisory/DynamicAdvisoryForm';
import { createAdvisoryApi } from '../api/advisory';
import { getFarmsApi } from '../api/farm';
import { Alert } from '../components/common/Alert';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NewAdvisoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Category from query param or default to crop_selection
  const initialCategory = (searchParams.get('category') as AdvisoryCategory) || 'crop_selection';
  const [category, setCategory] = useState<AdvisoryCategory>(initialCategory);

  const [farms, setFarms] = useState<Farm[]>([]);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setLoadingFarms(true);
        const res = await getFarmsApi();
        if (res.success) {
          setFarms(res.farms);
        }
      } catch {
        // Fallback silently if no farms created yet
      } finally {
        setLoadingFarms(false);
      }
    };
    fetchFarms();
  }, []);

  const handleSubmit = async (data: AdvisoryRequest) => {
    try {
      setSubmitting(true);
      setError(null);
      const res = await createAdvisoryApi(data);
      if (res.success && res.advisory) {
        navigate(`/advisory/${res.advisory.id}`);
      } else {
        throw new Error('Could not generate advisory plan');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate advisory. Please check your inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Title */}
      <div className="space-y-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Agronomic Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Request Precision Crop Advisory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Select your advisory domain below, provide farm and soil parameters, and receive an instant, structured action plan.
          </p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Step 1: Select Category */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm uppercase tracking-wider font-bold text-slate-700">
            Step 1: Choose Advisory Domain
          </h2>
          <span className="text-xs text-emerald-700 font-semibold">
            {category.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <CategorySelector
          selectedCategory={category}
          onSelectCategory={(cat) => setCategory(cat)}
        />
      </div>

      {/* Step 2: Form Parameters */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h2 className="text-sm uppercase tracking-wider font-bold text-slate-700">
          Step 2: Provide Farm & Crop Information
        </h2>
        <DynamicAdvisoryForm
          category={category}
          farms={farms}
          onSubmit={handleSubmit}
          loading={submitting}
        />
      </div>
    </div>
  );
};
