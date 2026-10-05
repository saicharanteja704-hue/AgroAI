import React, { useState, useEffect } from 'react';
import { AdvisoryCategory, AdvisoryRequest, Farm } from '../../types';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import {
  Sparkles,
  HelpCircle,
  Tractor,
  MapPin,
  Layers,
  Droplets,
  Calendar,
  AlertCircle,
  FileQuestion,
  CheckCircle,
} from 'lucide-react';

interface DynamicAdvisoryFormProps {
  category: AdvisoryCategory;
  farms: Farm[];
  onSubmit: (data: AdvisoryRequest) => Promise<void>;
  loading: boolean;
}

export const DynamicAdvisoryForm: React.FC<DynamicAdvisoryFormProps> = ({
  category,
  farms,
  onSubmit,
  loading,
}) => {
  // Farm selector or manual
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');

  // Common Form Fields
  const [crop, setCrop] = useState('');
  const [cropStage, setCropStage] = useState('');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [soilType, setSoilType] = useState('Loamy Soil');
  const [soilCondition, setSoilCondition] = useState('Good / Moderate Fertility');
  const [irrigationAvailability, setIrrigationAvailability] = useState('Tubewell / Drip Available');
  const [waterSource, setWaterSource] = useState('Borewell / Ground Water');
  const [farmSize, setFarmSize] = useState('2.5');
  const [landUnit, setLandUnit] = useState('Acres');
  const [question, setQuestion] = useState('');

  // Category Specific Fields
  // Pest / Disease
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [affectedArea, setAffectedArea] = useState('5% - 15% of crop area');
  const [duration, setDuration] = useState('3 - 5 days');
  const [recentWeather, setRecentWeather] = useState('Warm and high humidity');
  const [previousTreatment, setPreviousTreatment] = useState('None applied so far');

  // Fertilizer
  const [soilTestValues, setSoilTestValues] = useState('Medium N, Low P, Adequate K, pH 7.2');
  const [previousFertilizer, setPreviousFertilizer] = useState('Basal DAP at sowing');

  // Irrigation
  const [irrigationMethod, setIrrigationMethod] = useState('Drip Irrigation');
  const [recentRainfall, setRecentRainfall] = useState('No rain in last 10 days');

  // Crop Selection
  const [season, setSeason] = useState('Kharif (Monsoon)');
  const [preferredCropType, setPreferredCropType] = useState('Commercial / Cash Crop');

  // Harvest
  const [maturitySigns, setMaturitySigns] = useState('Foliage 70% yellowed, grain firm');
  const [storagePlan, setStoragePlan] = useState('Gunny bags on raised platform');

  // Form Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-populate when farm is selected
  useEffect(() => {
    if (selectedFarmId) {
      const farm = farms.find((f) => f.id === selectedFarmId);
      if (farm) {
        setLocation(farm.location || '');
        setState(farm.state || '');
        setDistrict(farm.district || '');
        setSoilType(farm.soil_type || 'Loamy Soil');
        setSoilCondition(farm.soil_condition || 'Good / Moderate Fertility');
        setIrrigationAvailability(farm.irrigation_availability || 'Tubewell / Drip Available');
        setWaterSource(farm.water_source || 'Borewell / Ground Water');
        setFarmSize(farm.farm_size ? farm.farm_size.toString() : '2.5');
        setLandUnit(farm.land_unit || 'Acres');
        if (farm.current_crop && !crop) {
          setCrop(farm.current_crop);
        }
        if (farm.crop_stage && !cropStage) {
          setCropStage(farm.crop_stage);
        }
      }
    }
  }, [selectedFarmId, farms]);

  const toggleSymptom = (sym: string) => {
    setSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!question.trim()) {
      newErrors.question = 'Please provide details or your question about this crop situation.';
    } else if (question.trim().length < 5) {
      newErrors.question = 'Please provide at least a few words describing your question.';
    }

    if (category !== 'crop_selection' && category !== 'general' && !crop.trim()) {
      newErrors.crop = 'Please specify the target crop name (e.g. Wheat, Tomato, Rice).';
    }

    if (!location.trim() && !selectedFarmId) {
      newErrors.location = 'Please provide the village/location.';
    }
    if (!state.trim() && !selectedFarmId) {
      newErrors.state = 'State is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Build category-specific input_data object
    const input_data: Record<string, any> = {
      location,
      state,
      district,
      soil_type: soilType,
      soil_condition: soilCondition,
      irrigation_availability: irrigationAvailability,
      water_source: waterSource,
      farm_size: farmSize,
      land_unit: landUnit,
    };

    if (category === 'pest_disease') {
      input_data.symptoms = symptoms.join(', ') || 'Reported symptoms in question';
      input_data.affected_area = affectedArea;
      input_data.duration = duration;
      input_data.recent_weather = recentWeather;
      input_data.previous_treatment = previousTreatment;
    } else if (category === 'fertilizer') {
      input_data.soil_test_values = soilTestValues;
      input_data.previous_fertilizer = previousFertilizer;
    } else if (category === 'irrigation') {
      input_data.irrigation_method = irrigationMethod;
      input_data.recent_rainfall = recentRainfall;
    } else if (category === 'crop_selection') {
      input_data.season = season;
      input_data.preferred_crop_type = preferredCropType;
    } else if (category === 'harvest') {
      input_data.maturity_signs = maturitySigns;
      input_data.storage_plan = storagePlan;
    }

    const payload: AdvisoryRequest = {
      category,
      crop: crop.trim() || undefined,
      crop_stage: cropStage.trim() || undefined,
      question: question.trim(),
      farm_id: selectedFarmId || undefined,
      input_data,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Farm Quick Select */}
      {farms.length > 0 && (
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2 text-emerald-900 font-semibold text-sm">
            <Tractor className="w-4 h-4 text-emerald-700" />
            <span>Link Saved Farm Profile (Optional)</span>
          </div>
          <p className="text-xs text-emerald-800/80 mb-3">
            Selecting your saved farm auto-populates soil, irrigation, location, and active crop data.
          </p>
          <select
            value={selectedFarmId}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="w-full bg-white border border-emerald-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="">-- Enter farm details manually --</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.farm_name} ({f.location}, {f.district} • {f.soil_type} • {f.farm_size} {f.land_unit})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Parameters Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-5">
        <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>Farm & Location Parameters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Village / Town / Area <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Rampur"
              className={`w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                errors.location ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.location && <p className="text-[11px] text-rose-600 mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              District
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. Warangal / Pune / Karnal"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              State <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Telangana / Maharashtra / Punjab"
              className={`w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                errors.state ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.state && <p className="text-[11px] text-rose-600 mt-1">{errors.state}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Soil Type
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="Loamy Soil">Loamy Soil (Fertile & balanced)</option>
              <option value="Black Cotton Soil">Black Cotton Soil (High clay & water-retentive)</option>
              <option value="Red Sandy Loam">Red Sandy Loam (Light & fast draining)</option>
              <option value="Alluvial Soil">Alluvial Soil (River basin rich loam)</option>
              <option value="Clayey Soil">Heavy Clay Soil</option>
              <option value="Sandy Soil">Sandy Soil (High percolation)</option>
              <option value="Laterite Soil">Laterite Soil (Acidic/High iron)</option>
              <option value="Saline / Alkaline Soil">Saline or Alkaline Soil</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Irrigation Facility
            </label>
            <select
              value={irrigationAvailability}
              onChange={(e) => setIrrigationAvailability(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="Tubewell / Drip Available">Assured Tubewell + Drip System</option>
              <option value="Canal Irrigation">Canal Irrigation (Scheduled rotation)</option>
              <option value="Borewell Sprinkler">Borewell with Sprinklers</option>
              <option value="Open Well / Pond">Farm Pond / Open Well (Seasonal)</option>
              <option value="Rainfed / Dryland">Rainfed / Completely Dryland</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Farm Size ({landUnit})
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                className="w-2/3 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <select
                value={landUnit}
                onChange={(e) => setLandUnit(e.target.value)}
                className="w-1/3 border border-slate-300 rounded-xl px-2 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="Acres">Acres</option>
                <option value="Hectares">Hectares</option>
                <option value="Bigha">Bigha</option>
                <option value="Guntha">Guntha</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Target Crop & Growth Stage */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Crop Details & Growth Stage</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Crop Name{' '}
              {category !== 'crop_selection' && category !== 'general' && (
                <span className="text-rose-500">*</span>
              )}
            </label>
            <input
              type="text"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              placeholder="e.g. Wheat, Tomato, Paddy/Rice, Cotton, Chili"
              className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                errors.crop ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.crop && <p className="text-[11px] text-rose-600 mt-1">{errors.crop}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Growth Stage
            </label>
            <select
              value={cropStage}
              onChange={(e) => setCropStage(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="">-- Select Crop Growth Stage --</option>
              <option value="Land Preparation / Sowing">Land Preparation / Sowing</option>
              <option value="Germination / Early Emergence (0-15 Days)">Germination / Early Emergence (0-15 Days)</option>
              <option value="Vegetative Canopy Growth (15-40 Days)">Vegetative Canopy Growth (15-40 Days)</option>
              <option value="Tillering / Branching">Tillering / Branching</option>
              <option value="Flowering / Anthesis">Flowering / Anthesis</option>
              <option value="Fruit Setting / Grain Filling">Fruit Setting / Grain Filling</option>
              <option value="Physiological Maturity / Pre-Harvest">Physiological Maturity / Pre-Harvest</option>
              <option value="Post-Harvest Handling">Post-Harvest Handling</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Category-Specific Information Panels */}
      {category === 'pest_disease' && (
        <div className="bg-rose-50/50 rounded-2xl border border-rose-200/80 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-950 font-semibold text-sm">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Pest & Disease Diagnostic Context</span>
          </div>
          <p className="text-xs text-rose-800/80">
            Select observable symptoms to help the AI narrow down possible insect vectors or fungal/bacterial pathogens.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Common Observed Symptoms (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Yellowing of leaves',
                'Curling / crinkling leaves',
                'Leaf spots / brown margins',
                'Powdery white or grey coating',
                'Sudden daytime wilting',
                'Stem boring / frass holes',
                'Flower or bud drop',
                'Fruit rot / dark patches',
                'Root knot or stunted vigor',
              ].map((sym) => {
                const checked = symptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      checked
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-rose-400'
                    }`}
                  >
                    {checked ? '✓ ' : '+ '}
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Affected Acreage / Plants
              </label>
              <select
                value={affectedArea}
                onChange={(e) => setAffectedArea(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="Isolated spots (< 5% of field)">Isolated spots (&lt; 5% of field)</option>
                <option value="5% - 15% of crop area">Moderate spread (5% - 15%)</option>
                <option value="Over 25% widespread damage">Widespread infestation (&gt; 25%)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Symptom Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="Observed within last 24-48 hours">Observed within last 24-48 hours</option>
                <option value="3 - 5 days">3 - 5 days</option>
                <option value="More than 1 week">More than 1 week</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Previous Sprays
              </label>
              <input
                type="text"
                value={previousTreatment}
                onChange={(e) => setPreviousTreatment(e.target.value)}
                placeholder="e.g. Neem oil, Mancozeb"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>
      )}

      {category === 'fertilizer' && (
        <div className="bg-purple-50/50 rounded-2xl border border-purple-200/80 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-purple-950 font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Soil Nutrient & Fertilizer Test Context</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Known Soil Health Card Test Values / pH
              </label>
              <input
                type="text"
                value={soilTestValues}
                onChange={(e) => setSoilTestValues(e.target.value)}
                placeholder="e.g. Nitrogen Low, Phosphorus Medium, pH 7.4"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Previously Applied Manure / Fertilizers
              </label>
              <input
                type="text"
                value={previousFertilizer}
                onChange={(e) => setPreviousFertilizer(e.target.value)}
                placeholder="e.g. 50kg DAP + 2 tonnes FYM at basal"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {category === 'crop_selection' && (
        <div className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-950 font-semibold text-sm">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Crop Selection & Season Preferences</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Cultivation Season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Kharif (Monsoon June-Oct)">Kharif (Monsoon: June - October)</option>
                <option value="Rabi (Winter Oct-March)">Rabi (Winter: October - March)</option>
                <option value="Zaid (Summer March-June)">Zaid (Summer: March - June)</option>
                <option value="Year-Round Perennial">Year-Round / Perennial Orchard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Category of Crops
              </label>
              <select
                value={preferredCropType}
                onChange={(e) => setPreferredCropType(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Commercial / Cash Crop">Commercial / High Market Return Cash Crop</option>
                <option value="Cereals & Food Grains">Cereals & Food Grains (Paddy, Wheat, Millets)</option>
                <option value="Legumes & Pulses">Legumes & Nitrogen-Fixing Pulses</option>
                <option value="Oilseeds">High-Demand Oilseeds (Mustard, Groundnut, Soybean)</option>
                <option value="Vegetables & Horticulture">High-Frequency Horticultural Vegetables</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Farmer's Specific Question or Situation */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-3">
        <label className="block text-sm font-semibold text-slate-900 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileQuestion className="w-4 h-4 text-emerald-600" />
            <span>Describe Your Question or Situation</span>
            <span className="text-rose-500">*</span>
          </span>
          <span className="text-[11px] font-normal text-slate-400">
            Be as specific as possible
          </span>
        </label>
        <textarea
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. My tomato crop leaves are developing brown rings on lower leaves, and yellowing is spreading up the stems. What treatment should I apply today?"
          className={`w-full border rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed ${
            errors.question ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300'
          }`}
        />
        {errors.question && (
          <p className="text-xs text-rose-600 font-medium">{errors.question}</p>
        )}
      </div>

      {/* Loading Progress Feedback when submitting */}
      {loading && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-pulse space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>AI Agronomic Engine in Action...</span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Analyzing farm soil characteristics, growth stage physiology, and local agronomic safety guidelines to construct your tailored action plan.
          </p>
        </div>
      )}

      {/* Submit Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Recommendations include immediate actions, risks, and follow-up guidance.</span>
        </p>

        <Button
          type="submit"
          size="lg"
          variant="primary"
          loading={loading}
          icon={<Sparkles className="w-5 h-5 text-emerald-200" />}
          className="w-full sm:w-auto px-8"
        >
          Generate AI Crop Advisory
        </Button>
      </div>
    </form>
  );
};
