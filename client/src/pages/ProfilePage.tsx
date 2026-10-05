import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi } from '../api/auth';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Tractor,
  Layers,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferred_language || 'English');
  const [location, setLocation] = useState(user?.location || '');
  const [state, setState] = useState(user?.state || '');
  const [district, setDistrict] = useState(user?.district || '');
  const [farmSize, setFarmSize] = useState(user?.farm_size ? user.farm_size.toString() : '');
  const [primaryCrops, setPrimaryCrops] = useState(
    Array.isArray(user?.primary_crops) ? user.primary_crops.join(', ') : ''
  );
  const [experienceYears, setExperienceYears] = useState(
    user?.experience_years ? user.experience_years.toString() : '5'
  );

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setPreferredLanguage(user.preferred_language || 'English');
      setLocation(user.location || '');
      setState(user.state || '');
      setDistrict(user.district || '');
      setFarmSize(user.farm_size ? user.farm_size.toString() : '');
      setPrimaryCrops(Array.isArray(user.primary_crops) ? user.primary_crops.join(', ') : '');
      setExperienceYears(user.experience_years ? user.experience_years.toString() : '5');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      setSaving(true);
      const cropsArray = primaryCrops
        ? primaryCrops.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const res = await updateProfileApi({
        name: name.trim(),
        phone: phone.trim() || null,
        preferred_language: preferredLanguage,
        location: location.trim() || null,
        state: state.trim() || null,
        district: district.trim() || null,
        farm_size: farmSize ? Number(farmSize) : null,
        primary_crops: cropsArray,
        experience_years: experienceYears ? Number(experienceYears) : 0,
      });

      if (res.success) {
        setSuccessMsg('Farmer profile details updated successfully.');
        await refreshUser();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile. Please verify your entries.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-emerald-700 mb-1">
          <User className="w-4 h-4" />
          <span>Account & Identity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Farmer Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Maintain your personal and agricultural details to ensure highly contextual AI recommendations.
        </p>
      </div>

      {successMsg && (
        <Alert type="success" message={successMsg} onClose={() => setSuccessMsg(null)} />
      )}
      {errorMsg && (
        <Alert type="error" message={errorMsg} onClose={() => setErrorMsg(null)} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Personal & Contact Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Farmer Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Email (Login ID)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Advisory Language
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
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
          </div>
        </div>

        {/* Agricultural Profile */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <Tractor className="w-4 h-4 text-emerald-600" />
            <span>Farm Location & Cultivation Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Village / Town
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Rampur"
                  className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Warangal"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Telangana"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Operational Land (Acres)
              </label>
              <input
                type="number"
                step="0.1"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                placeholder="e.g. 5.0"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Farming Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="e.g. 10"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Cultivated Crops
              </label>
              <input
                type="text"
                value={primaryCrops}
                onChange={(e) => setPrimaryCrops(e.target.value)}
                placeholder="e.g. Wheat, Cotton, Tomato"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={saving}
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
