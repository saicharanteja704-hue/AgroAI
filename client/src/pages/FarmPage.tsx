import React, { useEffect, useState } from 'react';
import { getFarmsApi, createFarmApi, updateFarmApi, deleteFarmApi } from '../api/farm';
import { Farm } from '../types';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import {
  Tractor,
  PlusCircle,
  MapPin,
  Layers,
  Droplets,
  Edit2,
  Trash2,
  Sprout,
  X,
  CheckCircle2,
} from 'lucide-react';

export const FarmPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Inputs
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [soilType, setSoilType] = useState('Loamy Soil');
  const [soilCondition, setSoilCondition] = useState('Good / Moderate Fertility');
  const [irrigationAvailability, setIrrigationAvailability] = useState('Tubewell / Drip Available');
  const [waterSource, setWaterSource] = useState('Borewell / Ground Water');
  const [farmSize, setFarmSize] = useState('3.0');
  const [landUnit, setLandUnit] = useState('Acres');
  const [currentCrop, setCurrentCrop] = useState('');
  const [previousCrop, setPreviousCrop] = useState('');
  const [cropStage, setCropStage] = useState('');

  const fetchFarms = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getFarmsApi();
      if (res.success) {
        setFarms(res.farms);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch farm records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const openNewModal = () => {
    setEditingFarm(null);
    setFarmName('Main Farm Parcel');
    setLocation('');
    setState('');
    setDistrict('');
    setSoilType('Loamy Soil');
    setSoilCondition('Good / Moderate Fertility');
    setIrrigationAvailability('Tubewell / Drip Available');
    setWaterSource('Borewell / Ground Water');
    setFarmSize('3.0');
    setLandUnit('Acres');
    setCurrentCrop('');
    setPreviousCrop('');
    setCropStage('');
    setModalOpen(true);
  };

  const openEditModal = (farm: Farm) => {
    setEditingFarm(farm);
    setFarmName(farm.farm_name);
    setLocation(farm.location);
    setState(farm.state);
    setDistrict(farm.district);
    setSoilType(farm.soil_type);
    setSoilCondition(farm.soil_condition || 'Good / Moderate Fertility');
    setIrrigationAvailability(farm.irrigation_availability);
    setWaterSource(farm.water_source || 'Borewell / Ground Water');
    setFarmSize(farm.farm_size ? farm.farm_size.toString() : '3.0');
    setLandUnit(farm.land_unit || 'Acres');
    setCurrentCrop(farm.current_crop || '');
    setPreviousCrop(farm.previous_crop || '');
    setCropStage(farm.crop_stage || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName.trim() || !location.trim() || !state.trim() || !district.trim()) {
      alert('Please fill out Farm Name, Location, District, and State.');
      return;
    }

    try {
      setSaving(true);
      const payload: Partial<Farm> = {
        farm_name: farmName.trim(),
        location: location.trim(),
        state: state.trim(),
        district: district.trim(),
        soil_type: soilType,
        soil_condition: soilCondition,
        irrigation_availability: irrigationAvailability,
        water_source: waterSource,
        farm_size: farmSize ? Number(farmSize) : undefined,
        land_unit: landUnit,
        current_crop: currentCrop.trim() || undefined,
        previous_crop: previousCrop.trim() || undefined,
        crop_stage: cropStage.trim() || undefined,
      };

      if (editingFarm) {
        const res = await updateFarmApi(editingFarm.id, payload);
        if (res.success) {
          setSuccess('Farm details updated successfully');
          setModalOpen(false);
          await fetchFarms();
        }
      } else {
        const res = await createFarmApi(payload);
        if (res.success) {
          setSuccess('New farm registered successfully');
          setModalOpen(false);
          await fetchFarms();
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save farm details');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this farm profile?')) return;
    try {
      const res = await deleteFarmApi(id);
      if (res.success) {
        setFarms((prev) => prev.filter((f) => f.id !== id));
        setSuccess('Farm profile removed');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete farm');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-emerald-700 mb-1">
            <Tractor className="w-4 h-4" />
            <span>Land & Crop Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Registered Farms & Plots
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Record soil characteristics and irrigation facilities to auto-populate future AI advisory requests.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Farm</span>
        </button>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Farms Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton rows={4} />
          <CardSkeleton rows={4} />
        </div>
      ) : farms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <div
              key={farm.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-card hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 group hover:border-emerald-300"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Tractor className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{farm.farm_name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {farm.location}, {farm.district}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {farm.farm_size || '0'} {farm.land_unit}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-500">Soil Type:</span>
                    <span className="font-semibold text-slate-900">{farm.soil_type}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-500">Irrigation:</span>
                    <span className="font-semibold text-slate-900">{farm.irrigation_availability}</span>
                  </div>
                  {farm.current_crop && (
                    <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-slate-200/60">
                      <span className="text-emerald-700 font-medium">Active Crop:</span>
                      <span className="font-bold text-emerald-900">{farm.current_crop}</span>
                    </div>
                  )}
                  {farm.crop_stage && (
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-500">Stage:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[160px]">
                        {farm.crop_stage}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(farm)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(farm.id)}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Tractor className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">No farm parcels registered</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Add your farm plots to speed up future advisory requests with auto-filled soil and water characteristics.
          </p>
          <button
            onClick={openNewModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-sm hover:bg-emerald-700"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add First Farm</span>
          </button>
        </div>
      )}

      {/* Modal for Add / Edit Farm */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 animate-fade-in my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingFarm ? 'Edit Farm Details' : 'Register New Farm Parcel'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Farm Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="e.g. North Orchard / Main Field"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Village / Town <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Rampur"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    District <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Warangal"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Telangana"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Soil Type
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Loamy Soil">Loamy Soil</option>
                    <option value="Black Cotton Soil">Black Cotton Soil</option>
                    <option value="Red Sandy Loam">Red Sandy Loam</option>
                    <option value="Alluvial Soil">Alluvial Soil</option>
                    <option value="Clayey Soil">Clayey Soil</option>
                    <option value="Sandy Soil">Sandy Soil</option>
                    <option value="Laterite Soil">Laterite Soil</option>
                    <option value="Saline / Alkaline Soil">Saline / Alkaline Soil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Irrigation Facility
                  </label>
                  <select
                    value={irrigationAvailability}
                    onChange={(e) => setIrrigationAvailability(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Tubewell / Drip Available">Assured Tubewell / Drip</option>
                    <option value="Canal Irrigation">Canal Irrigation</option>
                    <option value="Borewell Sprinkler">Borewell Sprinkler</option>
                    <option value="Open Well / Pond">Open Well / Farm Pond</option>
                    <option value="Rainfed / Dryland">Rainfed / Dryland</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Farm Size
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      value={farmSize}
                      onChange={(e) => setFarmSize(e.target.value)}
                      className="w-2/3 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs"
                    />
                    <select
                      value={landUnit}
                      onChange={(e) => setLandUnit(e.target.value)}
                      className="w-1/3 border border-slate-300 rounded-xl px-1.5 py-1.5 text-[11px] bg-white"
                    >
                      <option value="Acres">Acres</option>
                      <option value="Hectares">Hectares</option>
                      <option value="Bigha">Bigha</option>
                      <option value="Guntha">Guntha</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Crop
                  </label>
                  <input
                    type="text"
                    value={currentCrop}
                    onChange={(e) => setCurrentCrop(e.target.value)}
                    placeholder="e.g. Cotton"
                    className="w-full border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Crop Stage
                  </label>
                  <input
                    type="text"
                    value={cropStage}
                    onChange={(e) => setCropStage(e.target.value)}
                    placeholder="e.g. Flowering"
                    className="w-full border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={saving}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  {editingFarm ? 'Update Farm' : 'Register Farm'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
