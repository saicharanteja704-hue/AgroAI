import { z } from 'zod';

export const farmSchema = z.object({
  farm_name: z.string().trim().min(1, 'Farm name is required').max(120),
  location: z.string().trim().min(1, 'Location is required'),
  state: z.string().trim().min(1, 'State is required'),
  district: z.string().trim().min(1, 'District is required'),
  soil_type: z.string().trim().min(1, 'Soil type is required'),
  soil_condition: z.string().trim().optional().nullable(),
  irrigation_availability: z.string().trim().min(1, 'Irrigation availability is required'),
  water_source: z.string().trim().optional().nullable(),
  farm_size: z.union([z.number(), z.string().transform((v) => (v === '' ? null : Number(v)))]).optional().nullable(),
  land_unit: z.string().trim().default('Acres').optional(),
  current_crop: z.string().trim().optional().nullable(),
  previous_crop: z.string().trim().optional().nullable(),
  crop_stage: z.string().trim().optional().nullable(),
});
