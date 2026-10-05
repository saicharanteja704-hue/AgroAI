export type AdvisoryCategory =
  | 'crop_selection'
  | 'crop_management'
  | 'irrigation'
  | 'fertilizer'
  | 'pest_disease'
  | 'soil'
  | 'weather'
  | 'harvest'
  | 'general';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  preferred_language: string;
  location?: string | null;
  state?: string | null;
  district?: string | null;
  farm_size?: number | null;
  primary_crops?: string[] | null;
  experience_years?: number | null;
  created_at: string;
}

export interface Farm {
  id: string;
  user_id: string;
  farm_name: string;
  location: string;
  state: string;
  district: string;
  soil_type: string;
  soil_condition?: string | null;
  irrigation_availability: string;
  water_source?: string | null;
  farm_size?: number | null;
  land_unit?: string;
  current_crop?: string | null;
  previous_crop?: string | null;
  crop_stage?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Advisory {
  id: string;
  user_id: string;
  farm_id?: string | null;
  farm_name?: string | null;
  farm_location?: string | null;
  category: AdvisoryCategory;
  crop?: string | null;
  crop_stage?: string | null;
  question: string;
  input_data: Record<string, any>;
  summary: string;
  recommendation: string;
  reasoning: string;
  immediate_actions: string[];
  recommended_practices: string[];
  risks: string[];
  preventive_measures: string[];
  warnings: string[];
  follow_up_actions: string[];
  confidence_level: string;
  expert_consultation_triggers: string[];
  is_favorite: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AdvisoryRequest {
  category: AdvisoryCategory;
  crop?: string;
  crop_stage?: string;
  question: string;
  farm_id?: string;
  input_data: Record<string, any>;
}

export interface DashboardStats {
  totalAdvisories: number;
  categoryCounts: { category: AdvisoryCategory; count: string }[];
  farms: Farm[];
  recentAdvisories: Advisory[];
}
