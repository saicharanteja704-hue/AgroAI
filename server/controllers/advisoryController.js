import { query } from '../config/db.js';
import { generateCropAdvisory } from '../services/geminiService.js';

export const createAdvisory = async (req, res, next) => {
  try {
    const { category, crop, crop_stage, question, farm_id, input_data = {} } = req.body;

    let mergedData = { ...input_data };

    // If farm_id provided, fetch farm data to enrich context
    if (farm_id) {
      const farmRes = await query('SELECT * FROM farms WHERE id = $1 AND user_id = $2', [
        farm_id,
        req.user.id,
      ]);
      if (farmRes.rows.length > 0) {
        const farm = farmRes.rows[0];
        mergedData = {
          farm_name: farm.farm_name,
          location: farm.location,
          state: farm.state,
          district: farm.district,
          soil_type: farm.soil_type,
          soil_condition: farm.soil_condition,
          irrigation_availability: farm.irrigation_availability,
          water_source: farm.water_source,
          farm_size: farm.farm_size,
          land_unit: farm.land_unit,
          current_crop: crop || farm.current_crop,
          previous_crop: farm.previous_crop,
          crop_stage: crop_stage || farm.crop_stage,
          ...mergedData,
        };
      }
    }

    // Call AI advisory service
    const aiResult = await generateCropAdvisory({
      category,
      crop: crop || mergedData.current_crop || null,
      crop_stage: crop_stage || mergedData.crop_stage || null,
      question,
      input_data: mergedData,
      farmer_language: req.user.preferred_language || 'English',
    });

    // Save advisory in PostgreSQL database
    const insertRes = await query(
      `INSERT INTO advisories (
        user_id, farm_id, category, crop, crop_stage, question,
        input_data, summary, recommendation, reasoning,
        immediate_actions, recommended_practices, risks,
        preventive_measures, warnings, follow_up_actions,
        confidence_level, expert_consultation_triggers
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      ) RETURNING *`,
      [
        req.user.id,
        farm_id || null,
        category,
        crop || mergedData.current_crop || null,
        crop_stage || mergedData.crop_stage || null,
        question,
        JSON.stringify(mergedData),
        aiResult.summary,
        aiResult.recommendation,
        aiResult.reasoning,
        JSON.stringify(aiResult.immediate_actions),
        JSON.stringify(aiResult.recommended_practices),
        JSON.stringify(aiResult.risks),
        JSON.stringify(aiResult.preventive_measures),
        JSON.stringify(aiResult.warnings),
        JSON.stringify(aiResult.follow_up_actions),
        aiResult.confidence_level,
        JSON.stringify(aiResult.expert_consultation_triggers),
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Advisory successfully generated',
      advisory: insertRes.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getAdvisories = async (req, res, next) => {
  try {
    const { category, search, favorite, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let conditions = ['user_id = $1'];
    let params = [req.user.id];

    if (category && category !== 'all') {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    if (favorite === 'true') {
      conditions.push(`is_favorite = TRUE`);
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      conditions.push(
        `(LOWER(summary) LIKE $${params.length} OR LOWER(crop) LIKE $${params.length} OR LOWER(question) LIKE $${params.length})`
      );
    }

    const whereClause = conditions.join(' AND ');

    // Total count query
    const countRes = await query(
      `SELECT COUNT(*) as total FROM advisories WHERE ${whereClause}`,
      params
    );
    const totalCount = parseInt(countRes.rows[0].total, 10);

    // List query
    params.push(Number(limit), offset);
    const listRes = await query(
      `SELECT id, category, crop, crop_stage, question, summary, recommendation,
              confidence_level, is_favorite, status, created_at
       FROM advisories
       WHERE ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      success: true,
      advisories: listRes.rows,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdvisoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT a.*, f.farm_name, f.location as farm_location, f.soil_type, f.irrigation_availability
       FROM advisories a
       LEFT JOIN farms f ON a.farm_id = f.id
       WHERE a.id = $1 AND a.user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Advisory report not found' });
    }

    res.json({
      success: true,
      advisory: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      `UPDATE advisories
       SET is_favorite = NOT is_favorite, updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING id, is_favorite`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Advisory not found' });
    }

    res.json({
      success: true,
      is_favorite: result.rows[0].is_favorite,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdvisory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      `DELETE FROM advisories WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Advisory not found' });
    }

    res.json({
      success: true,
      message: 'Advisory report deleted from history',
      id,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Total advisories
    const totalRes = await query(
      'SELECT COUNT(*) as total FROM advisories WHERE user_id = $1',
      [req.user.id]
    );
    const totalAdvisories = parseInt(totalRes.rows[0].total, 10);

    // 2. Count by category
    const catRes = await query(
      `SELECT category, COUNT(*) as count
       FROM advisories
       WHERE user_id = $1
       GROUP BY category
       ORDER BY count DESC`,
      [req.user.id]
    );

    // 3. Farms count & crops
    const farmsRes = await query(
      `SELECT id, farm_name, current_crop, crop_stage, soil_type, irrigation_availability
       FROM farms
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    // 4. Recent advisories (top 4)
    const recentRes = await query(
      `SELECT id, category, crop, crop_stage, summary, confidence_level, is_favorite, created_at
       FROM advisories
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 4`,
      [req.user.id]
    );

    res.json({
      success: true,
      stats: {
        totalAdvisories,
        categoryCounts: catRes.rows,
        farms: farmsRes.rows,
        recentAdvisories: recentRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};
