import { query } from '../config/db.js';

export const getProfile = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.preferred_language, u.created_at,
              fp.location, fp.state, fp.district, fp.farm_size, fp.primary_crops, fp.experience_years
       FROM users u
       LEFT JOIN farmer_profiles fp ON u.id = fp.user_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    res.json({
      success: true,
      profile: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      preferred_language,
      location,
      state,
      district,
      farm_size,
      primary_crops,
      experience_years,
    } = req.body;

    const client = await query(
      `UPDATE users
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           preferred_language = COALESCE($3, preferred_language),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, email, phone, preferred_language`,
      [name, phone, preferred_language, req.user.id]
    );

    await query(
      `INSERT INTO farmer_profiles (user_id, location, state, district, farm_size, primary_crops, experience_years, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (user_id) DO UPDATE
       SET location = EXCLUDED.location,
           state = EXCLUDED.state,
           district = EXCLUDED.district,
           farm_size = EXCLUDED.farm_size,
           primary_crops = EXCLUDED.primary_crops,
           experience_years = EXCLUDED.experience_years,
           updated_at = NOW()`,
      [
        req.user.id,
        location || null,
        state || null,
        district || null,
        farm_size || null,
        Array.isArray(primary_crops) ? primary_crops : [],
        experience_years || 0,
      ]
    );

    // Fetch updated combined profile
    const updated = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.preferred_language, u.created_at,
              fp.location, fp.state, fp.district, fp.farm_size, fp.primary_crops, fp.experience_years
       FROM users u
       LEFT JOIN farmer_profiles fp ON u.id = fp.user_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updated.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
