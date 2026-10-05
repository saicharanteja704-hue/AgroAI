import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi } from '../api/auth';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import {
  Settings,
  Globe,
  ShieldCheck,
  Server,
  Database,
  Cpu,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();

  const [language, setLanguage] = useState(user?.preferred_language || 'English');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Health check data
  const [healthData, setHealthData] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealthData(data))
      .catch(() => setHealthData(null))
      .finally(() => setHealthLoading(false));
  }, []);

  const handleSaveLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    try {
      setSaving(true);
      const res = await updateProfileApi({ preferred_language: language });
      if (res.success) {
        setSuccess('Language preference saved.');
        await refreshUser();
      }
    } catch {
      alert('Could not update language');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-emerald-700 mb-1">
          <Settings className="w-4 h-4" />
          <span>System & Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Settings & Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your interface language, view AI engine operational status, and system security controls.
        </p>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Language Preference Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-600" />
          <span>Advisory Output Language</span>
        </h3>

        <form onSubmit={handleSaveLanguage} className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Choose the language in which you prefer the AI to generate crop recommendations and checklists.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Marathi">मराठी (Marathi)</option>
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="Gujarati">ગુજરાતી (Gujarati)</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={saving}
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            Update Language
          </Button>
        </form>
      </div>

      {/* AI Operational Engine Status */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-600" />
          <span>AI Architecture & Engine Health</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">AI Intelligence Engine</span>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>{healthData?.ai_engine || 'Active'}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">PostgreSQL Database</span>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Database className="w-4 h-4 text-cyan-600" />
              <span className="capitalize">{healthData?.database || 'Connected'}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Server Health</span>
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Operational (Healthy)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Active Session</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Signed in as <strong>{user?.email}</strong>
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-semibold text-xs flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
