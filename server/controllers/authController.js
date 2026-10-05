import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { generateToken } from '../middleware/authMiddleware.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, preferred_language } = req.body;

    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists. Please sign in.',
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const userRes = await query(
      `INSERT INTO users (name, email, password_hash, phone, preferred_language)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, preferred_language, created_at`,
      [name, email, passwordHash, phone || null, preferred_language || 'English']
    );

    const newUser = userRes.rows[0];

    // Create empty farmer profile
    await query(
      `INSERT INTO farmer_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
      [newUser.id]
    );

    const token = generateToken(newUser.id);

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userRes = await query(
      `SELECT id, name, email, password_hash, phone, preferred_language, created_at
       FROM users WHERE email = $1`,
      [email]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please try again.',
      });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please try again.',
      });
    }

    const token = generateToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Remove password hash from returned object
    const { password_hash, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Signed in successfully',
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Signed out successfully',
  });
};

export const me = async (req, res, next) => {
  try {
    const profileRes = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.preferred_language, u.created_at,
              fp.location, fp.state, fp.district, fp.farm_size, fp.primary_crops, fp.experience_years
       FROM users u
       LEFT JOIN farmer_profiles fp ON u.id = fp.user_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (profileRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    res.json({
      success: true,
      user: profileRes.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
