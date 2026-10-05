import bcrypt from 'bcryptjs';
import { pool, query } from '../config/db.js';
import { runMigrations } from './migrate.js';

export const seedDatabase = async () => {
  console.log('[Seeder] Starting database seeding...');
  await runMigrations();

  const demoEmail = 'farmer.ramesh@agroai.in';
  const demoPassword = 'farmer1234';
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(demoPassword, saltRounds);

  // 1. Check if user exists
  const existingUser = await query('SELECT id FROM users WHERE email = $1', [demoEmail]);

  let userId;
  if (existingUser.rows.length === 0) {
    const userRes = await query(
      `INSERT INTO users (name, email, password_hash, phone, preferred_language)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      ['Ramesh Patel', demoEmail, passwordHash, '+91 98765 43210', 'English']
    );
    userId = userRes.rows[0].id;
    console.log('[Seeder] Demo farmer user created:', demoEmail);
  } else {
    userId = existingUser.rows[0].id;
    console.log('[Seeder] Demo farmer already exists, reusing ID:', userId);
  }

  // 2. Farmer Profile
  await query(
    `INSERT INTO farmer_profiles (user_id, location, state, district, farm_size, primary_crops, experience_years)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id) DO UPDATE
     SET location = EXCLUDED.location,
         state = EXCLUDED.state,
         district = EXCLUDED.district,
         farm_size = EXCLUDED.farm_size,
         primary_crops = EXCLUDED.primary_crops,
         experience_years = EXCLUDED.experience_years`,
    [
      userId,
      'Rampur Village',
      'Telangana',
      'Warangal',
      4.5,
      ['Wheat', 'Cotton', 'Chili', 'Tomato'],
      12,
    ]
  );

  // 3. Farms
  const existingFarms = await query('SELECT id FROM farms WHERE user_id = $1', [userId]);
  let farm1Id, farm2Id;

  if (existingFarms.rows.length === 0) {
    const f1 = await query(
      `INSERT INTO farms (
        user_id, farm_name, location, state, district, soil_type,
        soil_condition, irrigation_availability, water_source,
        farm_size, land_unit, current_crop, previous_crop, crop_stage
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id`,
      [
        userId,
        'Green Valley Main Plot',
        'Rampur North',
        'Telangana',
        'Warangal',
        'Black Cotton Soil',
        'High organic matter, fertile',
        'Tubewell / Drip Available',
        'Deep Borewell',
        3.0,
        'Acres',
        'Cotton',
        'Pigeon Pea',
        'Flowering / Anthesis',
      ]
    );
    farm1Id = f1.rows[0].id;

    const f2 = await query(
      `INSERT INTO farms (
        user_id, farm_name, location, state, district, soil_type,
        soil_condition, irrigation_availability, water_source,
        farm_size, land_unit, current_crop, previous_crop, crop_stage
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id`,
      [
        userId,
        'Hillside Horticulture Plot',
        'Rampur East',
        'Telangana',
        'Warangal',
        'Red Sandy Loam',
        'Well drained, slightly acidic',
        'Borewell Sprinkler',
        'Farm Pond & Borewell',
        1.5,
        'Acres',
        'Tomato',
        'Okra',
        'Fruit Setting / Sizing',
      ]
    );
    farm2Id = f2.rows[0].id;
    console.log('[Seeder] Registered 2 demo farms.');
  } else {
    farm1Id = existingFarms.rows[0].id;
    farm2Id = existingFarms.rows[1]?.id || farm1Id;
  }

  // 4. Advisories (Realistic historical advisories)
  const existingAdvisories = await query('SELECT COUNT(*) as count FROM advisories WHERE user_id = $1', [userId]);
  if (parseInt(existingAdvisories.rows[0].count, 10) === 0) {
    // Advisory 1: Pest Management on Cotton
    await query(
      `INSERT INTO advisories (
        user_id, farm_id, category, crop, crop_stage, question,
        input_data, summary, recommendation, reasoning,
        immediate_actions, recommended_practices, risks,
        preventive_measures, warnings, follow_up_actions,
        confidence_level, expert_consultation_triggers, is_favorite
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
      [
        userId,
        farm1Id,
        'pest_disease',
        'Cotton',
        'Flowering / Anthesis',
        'Observed curling of upper leaves and tiny white insects fluttering beneath leaf surfaces. What immediate control is advised?',
        JSON.stringify({ location: 'Rampur North', state: 'Telangana', soil_type: 'Black Cotton Soil', symptoms: 'Leaf curling, whitefly activity' }),
        'Preliminary assessment identifies silverleaf whitefly (Bemisia tabaci) infestation triggering leaf crinkling in cotton.',
        'Implement an Integrated Pest Management (IPM) regime focusing on yellow sticky card mass trapping and cold-pressed neem-based biological foliar treatment before chemical escalation.',
        'Whiteflies transmit cotton leaf curl geminivirus (CLCuV) and secrete sticky honeydew that promotes sooty mold. Non-chemical control preserves natural chrysoperla and ladybird beetle predators.',
        JSON.stringify([
          'Erect 15-20 yellow sticky traps per acre at canopy height to monitor and reduce adult flying whitefly populations.',
          'Spray 10,000 ppm cold-pressed Neem Oil (Azadirachtin) at 3 ml per liter of water with 1 ml liquid soap sticker during late evening.',
          'Prune and destroy congested lower sucker branches to improve ventilation and sun penetration.',
        ]),
        JSON.stringify([
          'Avoid excessive urea (nitrogen) applications which induce succulent, soft foliage favored by sucking pests.',
          'Plant border rows of Maize or Sorghum to serve as physical wind barriers and biological refuge for beneficial predators.',
        ]),
        JSON.stringify([
          'Rapid transmission of Cotton Leaf Curl Virus leading to floral abortion and square drop.',
          'Sooty mold colonization on honeydew reducing photosynthetic leaf efficiency.',
        ]),
        JSON.stringify([
          'Adopt sucking-pest tolerant Bt cotton hybrids in the upcoming sowing window.',
          'Maintain clean field borders free from alternative weed hosts (Parthenium, Abutilon).',
        ]),
        JSON.stringify([
          'Do not apply broad-spectrum synthetic pyrethroids which cause whitefly population flare-back by eliminating natural predators.',
          'Always wear protective eye mask and rubber gloves when spraying.',
        ]),
        JSON.stringify([
          'Examine 20 randomly selected plants 72 hours post-spray; verify if adult whitefly count drops below economic threshold (6-8 per leaf).',
          'Inspect leaf underside for sooty mold development at 7 days.',
        ]),
        'Preliminary Possibility',
        JSON.stringify([
          'If whitefly density exceeds 20 adults per leaf across >20% of the field area despite biopesticide spray.',
          'If severe systemic vein thickening and leaf upward cupping spreads across adjacent rows.',
        ]),
        true,
      ]
    );

    // Advisory 2: Fertilizer Nutrition on Tomato
    await query(
      `INSERT INTO advisories (
        user_id, farm_id, category, crop, crop_stage, question,
        input_data, summary, recommendation, reasoning,
        immediate_actions, recommended_practices, risks,
        preventive_measures, warnings, follow_up_actions,
        confidence_level, expert_consultation_triggers, is_favorite
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
      [
        userId,
        farm2Id,
        'fertilizer',
        'Tomato',
        'Fruit Setting / Sizing',
        'Fruits are expanding rapidly; how should I balance potassium and calcium to prevent blossom end rot and maximize fruit size?',
        JSON.stringify({ location: 'Rampur East', soil_type: 'Red Sandy Loam', irrigation_availability: 'Borewell Sprinkler' }),
        'Nutritional advisory for tomato fruit setting: Optimize water-soluble Potassium and foliar Chelated Calcium to prevent blossom-end necrosis.',
        'Apply split fertigation with Potassium Sulphate (0-0-50) and spray Chelated Calcium (EDTA-Ca) at 1.5g/L to ensure firm cell wall formation and uniform fruit sizing.',
        'Calcium is relatively immobile in plant vascular systems; during rapid fruit cell expansion, localized calcium deficiency causes cell breakdown at the distal fruit blossom end.',
        JSON.stringify([
          'Apply a foliar spray of Chelated Calcium EDTA (1.5g/L) + Boron (1g/L) to enhance calcium mobility and fruit skin elasticity.',
          'Incorporate Potassium Nitrate (13-0-45) at 4 kg per acre through irrigation to stimulate fruit pulp density.',
          'Ensure consistent, moderate soil moisture without alternating dry and waterlogged cycles.',
        ]),
        JSON.stringify([
          'Maintain balanced soil pH between 6.2 and 6.8 to maximize calcium and magnesium root absorption.',
          'Use plastic or organic straw mulch to keep root-zone moisture uniform.',
        ]),
        JSON.stringify([
          'Blossom End Rot (BER) causing dark, sunken leathery lesions on fruit tips, rendering produce unmarketable.',
          'Radial fruit cracking if heavy irrigation succeeds prolonged dry periods.',
        ]),
        JSON.stringify([
          'Conduct preseason soil lime or gypsum treatment in acidic or calcium-deficient sandy loam plots.',
        ]),
        JSON.stringify([
          'Do not mix Calcium Nitrate with Phosphates or Sulphates in the same spray tank to avoid insoluble precipitate.',
        ]),
        JSON.stringify([
          'Inspect newly set fruit clusters 5 days post-spray for uniform skin gloss and absence of dark tip spots.',
        ]),
        'High',
        JSON.stringify([
          'If greater than 10% of green fruits exhibit dark sunken patches at blossom ends.',
        ]),
        true,
      ]
    );

    // Advisory 3: Precision Irrigation on Wheat
    await query(
      `INSERT INTO advisories (
        user_id, farm_id, category, crop, crop_stage, question,
        input_data, summary, recommendation, reasoning,
        immediate_actions, recommended_practices, risks,
        preventive_measures, warnings, follow_up_actions,
        confidence_level, expert_consultation_triggers, is_favorite
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
      [
        userId,
        farm1Id,
        'irrigation',
        'Wheat',
        'Germination / Early Emergence (0-15 Days)',
        'Wheat is at 21 days after sowing. Is it time for the first irrigation, and how much water is safe?',
        JSON.stringify({ location: 'Rampur North', soil_type: 'Black Cotton Soil', crop_stage: 'Crown Root Initiation' }),
        'Critical Crown Root Initiation (CRI) irrigation advisory: The first watering at 20-25 days after sowing is mandatory for wheat root anchoring.',
        'Provide a light to moderate irrigation (5-6 cm depth) immediately to support crown root transition. Avoid standing water in heavy black soil.',
        'Crown root initiation (CRI) at 21 days post-sowing establishes the secondary root system and determines tiller potential. Moisture deficit at CRI reduces grain yield by up to 35%.',
        JSON.stringify([
          'Initiate light surface irrigation within the next 24-48 hours.',
          'Open field drainage furrows to ensure excess water drains out within 2 hours of watering.',
          'Broadcast first split top-dressing of urea (30 kg/acre) right before or immediately following light irrigation.',
        ]),
        JSON.stringify([
          'Irrigate in the early morning to minimize thermal shock to young wheat seedlings.',
          'Schedule future waterings at key physiological checkpoints: Tillering (40 DAS) and Flowering (65 DAS).',
        ]),
        JSON.stringify([
          'Permanent root stunting and reduced effective earheads if CRI irrigation is skipped.',
          'Yellowing of seedlings due to temporary root waterlogging in heavy clay depressions.',
        ]),
        JSON.stringify([
          'Ensure precision laser land leveling prior to wheat sowing for uniform water advance.',
        ]),
        JSON.stringify([
          'Do not apply heavy flood irrigation; water depth must not submerge seedling crowns.',
        ]),
        JSON.stringify([
          'Check root anchoring 4 days after irrigation; seedlings should hold firm when gently pulled.',
          'Monitor tiller emergence at 30-35 days.',
        ]),
        'High',
        JSON.stringify([
          'If persistent yellowing and seedling damping-off occurs following irrigation.',
        ]),
        false,
      ]
    );

    console.log('[Seeder] Inserted 3 realistic historical crop advisories.');
  }

  console.log('[Seeder] Database seeding finished successfully.');
};

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
