import { z } from 'zod';

export const advisoryCategories = [
  'crop_selection',
  'crop_management',
  'irrigation',
  'fertilizer',
  'pest_disease',
  'soil',
  'weather',
  'harvest',
  'general',
];

export const advisoryRequestSchema = z.object({
  category: z.enum([
    'crop_selection',
    'crop_management',
    'irrigation',
    'fertilizer',
    'pest_disease',
    'soil',
    'weather',
    'harvest',
    'general',
  ]),
  crop: z.string().trim().optional().nullable(),
  crop_stage: z.string().trim().optional().nullable(),
  question: z.string().trim().min(3, 'Please provide your question or situation details (min 3 characters)'),
  farm_id: z.string().uuid().optional().nullable(),
  input_data: z.record(z.any()).default({}),
});

export const aiOutputSchema = z.object({
  summary: z.string().min(5, 'Summary is required'),
  recommendation: z.string().min(10, 'Recommendation is required'),
  reasoning: z.string().min(10, 'Reasoning is required'),
  immediate_actions: z.array(z.string()).min(1, 'At least one immediate action required'),
  recommended_practices: z.array(z.string()).min(1, 'Recommended practices required'),
  risks: z.array(z.string()).default([]),
  preventive_measures: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  follow_up_actions: z.array(z.string()).default([]),
  confidence_level: z.string().default('High'),
  expert_consultation_triggers: z.array(z.string()).default([]),
});
