import { query } from '../config/db.js';

export const getFarms = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT * FROM farms WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      farms: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getFarmById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT * FROM farms WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Farm record not found' });
    }

    res.json({
      success: true,
      farm: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const createFarm = async (req, res, next) => {
  try {
    const {
      farm_name,
      location,
      state,
      district,
      soil_type,
      soil_condition,
      irrigation_availability,
      water_source,
      farm_size,
      land_unit,
      current_crop,
      previous_crop,
      crop_stage,
    } = req.body;

    const result = await query(
      `INSERT INTO farms (
        user_id, farm_name, location, state, district, soil_type,
        soil_condition, irrigation_availability, water_source,
        farm_size, land_unit, current_crop, previous_crop, crop_stage
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        req.user.id,
        farm_name,
        location,
        state,
        district,
        soil_type,
        soil_condition || null,
        irrigation_availability,
        water_source || null,
        farm_size || null,
        land_unit || 'Acres',
        current_crop || null,
        previous_crop || null,
        crop_stage || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Farm information registered successfully',
      farm: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const updateFarm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      farm_name,
      location,
      state,
      district,
      soil_type,
      soil_condition,
      irrigation_availability,
      water_source,
      farm_size,
      land_unit,
      current_crop,
      previous_crop,
      crop_stage,
    } = req.body;

    const result = await query(
      `UPDATE farms
       SET farm_name = $1,
           location = $2,
           state = $3,
           district = $4,
           soil_type = $5,
           soil_condition = $6,
           irrigation_availability = $7,
           water_source = $8,
           farm_size = $9,
           land_unit = $10,
           current_crop = $11,
           previous_crop = $12,
           crop_stage = $13,
           updated_at = NOW()
       WHERE id = $14 AND user_id = $15
       RETURNING *`,
      [
        farm_name,
        location,
        state,
        district,
        soil_type,
        soil_condition || null,
        irrigation_availability,
        water_source || null,
        farm_size || null,
        land_unit || 'Acres',
        current_crop || null,
        previous_crop || null,
        crop_stage || null,
        id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Farm not found or unauthorized' });
    }

    res.json({
      success: true,
      message: 'Farm information updated successfully',
      farm: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFarm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      `DELETE FROM farms WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Farm not found or unauthorized' });
    }

    res.json({
      success: true,
      message: 'Farm removed successfully',
      id,
    });
  } catch (error) {
    next(error);
  }
};
