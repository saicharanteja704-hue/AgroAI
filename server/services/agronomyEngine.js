/**
 * Advanced Agronomic Intelligence Engine
 * Provides structured, agronomic reasoning, safety guardrails,
 * and localized precision farming knowledge across all 9 agricultural domains.
 */

export const generateAgronomicAdvisory = (category, crop, cropStage, question, inputData = {}) => {
  const cleanCrop = (crop || inputData.current_crop || 'General Crop').trim();
  const cleanStage = (cropStage || inputData.crop_stage || 'Active Growth Stage').trim();
  const soilType = inputData.soil_type || 'Loamy';
  const waterAvail = inputData.irrigation_availability || 'Moderate';
  const location = inputData.location || inputData.state || 'Local Region';

  switch (category) {
    case 'crop_selection':
      return {
        summary: `Tailored crop selection advisory for ${soilType} soil in ${location} with ${waterAvail} water availability.`,
        recommendation: `Recommended Primary Cultivars: For ${soilType} soil and ${waterAvail.toLowerCase()} water resources, consider high-yield, climate-resilient pulses (Pigeon pea / Chickpea) or oilseeds (Mustard / Soybean) in rotation with cereals (Wheat or Millets/Sorghum). If drip irrigation is available, high-value horticulture crops like Tomato or Chili offer strong return on investment.`,
        reasoning: `${soilType} soils have specific moisture retention characteristics. Combined with ${waterAvail.toLowerCase()} irrigation, planting deep-rooted, drought-tolerant legumes restores nitrogen naturally via Rhizobium symbiosis while reducing synthetic fertilizer dependency by up to 25-30%.`,
        immediate_actions: [
          `Conduct a standard soil fertility test (pH, EC, Organic Carbon, Available N-P-K) before seed procurement.`,
          `Procure certified, pathogen-free seeds treated with Trichoderma viride or standard fungicide.`,
          `Prepare the seedbed with 4-5 tonnes of well-decomposed Farm Yard Manure (FYM) per acre during primary tillage.`,
        ],
        recommended_practices: [
          `Adopt ridge and furrow planting or raised bed systems to prevent waterlogging during unseasonal rains.`,
          `Incorporate a short-duration green manuring crop (like Sunn hemp or Dhaincha) before sowing the main cash crop.`,
          `Check local agricultural university (SAU) or KVK varietal advisories for disease-resistant local varieties.`,
        ],
        risks: [
          `Soil moisture deficiency during critical germination phase if monsoon rains are erratic.`,
          `Nutrient lock-in if soil pH is outside the optimal 6.5 - 7.8 range.`,
        ],
        preventive_measures: [
          `Apply organic mulch (crop residue / straw) to conserve surface soil moisture after sowing.`,
          `Ensure field leveling using laser land levelers for uniform water distribution and seed emergence.`,
        ],
        warnings: [
          `Do not purchase uncertified or unbranded seeds from unauthorized vendors without a valid receipt and germination guarantee.`,
        ],
        follow_up_actions: [
          `Inspect germination rate at 7-10 days after sowing.`,
          `Perform first inter-cultivation weeding at 20-25 days after emergence.`,
        ],
        confidence_level: 'High',
        expert_consultation_triggers: [
          `If soil salinity (EC > 2.0 dS/m) or extreme alkalinity (pH > 8.5) is detected in soil test.`,
          `Before purchasing high-cost commercial hybrid seeds for large acreages.`,
        ],
      };

    case 'pest_disease':
      const symptoms = inputData.symptoms || question || 'leaf spotting and wilting';
      return {
        summary: `Preliminary diagnosis and Integrated Pest & Disease Management (IPM) advisory for ${cleanCrop} at ${cleanStage}.`,
        recommendation: `Preliminary Assessment: Symptoms described ("${symptoms.slice(0, 60)}...") suggest potential fungal foliar pathogen or sap-sucking pest infestation in ${cleanCrop}. Implement non-chemical cultural controls and biological intervention first before considering targeted low-toxicity chemical sprays.`,
        reasoning: `Visual symptom analysis without microscopic or laboratory confirmation remains a preliminary assessment. Integrated Pest Management (IPM) safeguards beneficial predatory insects (ladybird beetles, chrysoperla) and prevents pest resurgence or chemical resistance.`,
        immediate_actions: [
          `Isolate and rogue out severely damaged or dead plants from the field and safely destroy them away from cultivation areas.`,
          `Install yellow and blue sticky traps (15-20 traps per acre) to monitor and suppress adult flying vector populations (whiteflies, thrips, aphids).`,
          `Spray cold-pressed Neem Oil (10,000 ppm) at 3-5 ml per liter of water with 1 ml liquid soap sticker during early morning or late afternoon.`,
        ],
        recommended_practices: [
          `Ensure balanced plant nutrition; avoid excessive nitrogenous (urea) fertilizer, which makes foliage tender and prone to sucking pests.`,
          `Improve field air circulation by maintaining recommended plant spacing and pruning congested lower leaves.`,
          `If fungal spores are suspected, spray biological bio-fungicide Bacillus subtilis or Trichoderma harzianum at 5g/liter.`,
        ],
        risks: [
          `Rapid spread across adjacent healthy rows under humid, cloudy weather conditions.`,
          `Indiscriminate broad-spectrum pesticide spraying killing natural beneficial predators.`,
        ],
        preventive_measures: [
          `Practice seed treatment with carbendazim or biological Trichoderma before future planting.`,
          `Rotate crops with non-host botanical families in the next cropping cycle.`,
        ],
        warnings: [
          `This assessment is based strictly on reported symptoms and is not a definitive laboratory confirmation.`,
          `Always wear protective PPE (gloves, face mask, eye protection) when handling any agricultural spray. Do not spray during windy conditions.`,
        ],
        follow_up_actions: [
          `Inspect treated plants 72 hours post-application for arrest of symptoms or new leaf emergence.`,
          `If wilting continues at root collar level, collect a whole plant specimen for local extension review.`,
        ],
        confidence_level: 'Preliminary Possibility',
        expert_consultation_triggers: [
          `If more than 15-20% of the field area exhibits rapid spreading necrosis, vascular wilting, or sudden leaf drop within 48 hours.`,
          `Before mixing multiple chemical fungicides or synthetic insecticides in the spray tank.`,
        ],
      };

    case 'irrigation':
      return {
        summary: `Precision water management and irrigation schedule for ${cleanCrop} at ${cleanStage}.`,
        recommendation: `Maintain soil moisture between 60-70% of available field capacity. Avoid water stress especially during critical growth windows (flowering, pod/grain filling, or fruit setting). Water during early morning or late evening hours to minimize evaporative losses.`,
        reasoning: `${cleanCrop} is particularly sensitive to root hypoxia from standing water as well as cellular desiccation from moisture stress. Micro-irrigation (drip or micro-sprinkler) delivers water directly to the active root zone, saving 40-50% water while improving nutrient uptake efficiency.`,
        immediate_actions: [
          `Perform a soil feel-and-appearance test: roll topsoil at 15cm depth into a ball; if it crumbles easily without sticking, irrigate immediately.`,
          `Inspect irrigation lines for emitter clogs, leaks, or uneven pressure across the field layout.`,
          `Ensure drainage furrows are cleared to allow rapid drainage of excess water after heavy precipitation.`,
        ],
        recommended_practices: [
          `Adopt drip irrigation with fertigation capabilities for high-frequency, low-volume watering.`,
          `Apply 5-7 cm organic crop residue mulch or silver-black plastic mulch to reduce surface evaporation by up to 35%.`,
          `Monitor weather forecasts and withhold scheduled irrigation if rainfall is predicted within 24 hours.`,
        ],
        risks: [
          `Over-irrigation leading to root rot (Phytophthora / Pythium) and nutrient leaching beyond root depth.`,
          `Moisture stress during flowering causing blossom drop and reduced test-grain weight.`,
        ],
        preventive_measures: [
          `Install tensiometers or basic soil moisture probes at 15cm and 30cm root depths for data-driven irrigation timing.`,
          `Form sub-bunds across field slopes to retard runoff and encourage rainwater infiltration.`,
        ],
        warnings: [
          `Never irrigate under peak midday sun (12 PM - 3 PM) as rapid temperature shock damages tender feeder roots.`,
        ],
        follow_up_actions: [
          `Check field drainage 2 hours after irrigation; water should fully infiltrate without surface puddling.`,
          `Adjust irrigation volume downward as the crop approaches physiological maturity.`,
        ],
        confidence_level: 'High',
        expert_consultation_triggers: [
          `If irrigation well water turns saline or exhibits high sodium absorption ratio (SAR > 10).`,
          `If persistent root yellowing appears despite regular watering (indicative of root asphyxiation or nematode galling).`,
        ],
      };

    case 'fertilizer':
      return {
        summary: `Balanced plant nutrition and fertilizer management protocol for ${cleanCrop} at ${cleanStage}.`,
        recommendation: `Apply split doses of nitrogen (N) combined with balanced phosphorus (P), potassium (K), and essential secondary nutrients (Sulphur, Zinc). Shift from high-nitrogen vegetative feeding to balanced potassium-rich nutrition as plants transition into reproductive flowering and fruiting.`,
        reasoning: `Split fertilizer applications match the crop's nutrient uptake curve, drastically reducing volatilization of ammoniacal nitrogen into the atmosphere and nitrate leaching into groundwater. Potassium strengthens cell walls, confers drought tolerance, and maximizes fruit/grain size.`,
        immediate_actions: [
          `If basal phosphorus (DAP/SSP) was not applied, top-dress with water-soluble 19-19-19 or 13-0-45 based on current growth phase.`,
          `Address chlorosis (yellowing between leaf veins) with a foliar spray of Chelated Zinc (1g/L) + Ferrous Sulphate (2g/L) with citric acid buffer.`,
          `Side-dress nitrogenous fertilizers 5-8 cm away from plant stems, followed immediately by light irrigation.`,
        ],
        recommended_practices: [
          `Always base chemical application rates on a recent laboratory Soil Health Card test report.`,
          `Integrate biofertilizers: Azotobacter / Rhizobium (nitrogen fixers) and PSB (Phosphorus Solubilizing Bacteria) with vermicompost.`,
          `Incorporate neem-coated urea to slow nitrification and extend nitrogen availability over 3-4 weeks.`,
        ],
        risks: [
          `Excessive nitrogen promoting lush, succulent growth that attracts leaf folders, stem borers, and powdery mildew.`,
          `Fertilizer burn if synthetic salts are applied directly on wet foliage or in dry soil without subsequent watering.`,
        ],
        preventive_measures: [
          `Apply organic compost annually to build soil cation exchange capacity (CEC) and buffer nutrient release.`,
          `Use soil-specific micronutrient mixtures rather than random chemical combinations.`,
        ],
        warnings: [
          `Do not apply dry granular fertilizers without following up with irrigation or soil moisture.`,
          `Do not mix calcium nitrate directly with sulphate or phosphate fertilizers in the same spray tank to avoid precipitation.`,
        ],
        follow_up_actions: [
          `Observe canopy leaf color response 5-7 days after application using a Leaf Color Chart (LCC).`,
          `Record exact fertilizer quantities and dates in your farm ledger for seasonal cost and yield correlation.`,
        ],
        confidence_level: 'High',
        expert_consultation_triggers: [
          `If widespread leaf tip burning or interveinal necrosis occurs immediately following fertilizer top-dressing.`,
          `For precise fertigation scheduling in commercial drip-irrigated polyhouse or high-density orchards.`,
        ],
      };

    case 'soil':
      return {
        summary: `Comprehensive soil health, structure, and fertility optimization advisory for ${soilType} soil.`,
        recommendation: `Focus on elevating Soil Organic Carbon (SOC) above 0.75%, correcting compaction layers, and regulating pH to optimize biological microbial activity and cation exchange capacity.`,
        reasoning: `Soil organic matter acts as a biological sponge, holding up to 10 times its weight in water and providing habitat for mycorrhizal fungi and beneficial plant-growth-promoting rhizobacteria (PGPR). Healthy soil significantly reduces chemical input expenditures.`,
        immediate_actions: [
          `Broadcast 2 to 3 tonnes of well-composted organic manure or vermicompost per acre before cross-ploughing.`,
          `If soil is acidic (pH < 6.0), apply agricultural lime; if alkaline (pH > 8.0) with sodium accumulation, apply agricultural gypsum with deep flushing.`,
          `Avoid heavy machinery traffic when soil is wet to prevent subsoil hardpan formation.`,
        ],
        recommended_practices: [
          `Practice minimum tillage / conservation agriculture to preserve soil structure and earthworm populations.`,
          `Rotate with deep taproot crops (sunflower, pigeon pea) to naturally fracture compacted subsoil horizons.`,
          `Sow cover crops (Cowpea or Sunn hemp) during fallow windows to prevent soil erosion from wind and runoff.`,
        ],
        risks: [
          `Nutrient immobilization in highly alkaline or calcerous soils.`,
          `Topsoil erosion and fertility depletion if soil remains bare between crop seasons.`,
        ],
        preventive_measures: [
          `Establish contour bunding and vegetative vetiver grass barriers along natural slopes.`,
          `Retain 30% crop stubble on the soil surface rather than open-field residue burning.`,
        ],
        warnings: [
          `Never burn crop stubble; burning destroys beneficial soil microflora, volatilizes organic nitrogen, and degrades soil texture.`,
        ],
        follow_up_actions: [
          `Send soil samples for testing every 2 years before the onset of the primary planting season.`,
          `Track earthworm count per cubic foot of topsoil as a natural biological fertility indicator.`,
        ],
        confidence_level: 'High',
        expert_consultation_triggers: [
          `If soil test reveals electrical conductivity (EC) exceeding 4.0 dS/m or exchangeable sodium percentage (ESP) > 15%.`,
          `When reclamation of waterlogged or saline-alkali land is required.`,
        ],
      };

    case 'weather':
      return {
        summary: `Weather-aware crop risk mitigation and protective advisory for ${cleanCrop}.`,
        recommendation: `Recommendation is based on user-supplied weather context (not live sensor feeds). Implement proactive canopy protection, adjust irrigation timings, and ensure field drainage to buffer against thermal shock, excessive rain, or sudden dry spells.`,
        reasoning: `Extreme temperature oscillations disrupt pollen viability, accelerate transpiration stress, and trigger enzymatic degradation. Microclimate management via shading, windbreaks, and light irrigations stabilizes root-zone temperatures.`,
        immediate_actions: [
          `For heat stress: Provide light, frequent sprinkler or drip irrigations during evening hours to cool the root envelope.`,
          `For heavy rainfall forecasts: Inspect and clear master field drainage channels and open bund outlets to prevent standing water.`,
          `For high winds: Provide bamboo or twine staking for tall crops (Banana, Maize, Tomato) to prevent lodging.`,
        ],
        recommended_practices: [
          `Apply anti-transpirant foliar spray (like 2% Potassium Nitrate or Kaolin clay at 4%) to reduce heat-induced moisture loss.`,
          `Maintain an agro-forestry or tree shelterbelt along the windward boundary of the farm.`,
          `Utilize plastic or organic straw mulches to insulate soil temperature against extreme heat or cold waves.`,
        ],
        risks: [
          `Severe lodging of standing crops in high-velocity storm winds.`,
          `Flower dropping and sterile pollen when daytime temperatures exceed 38°C during anthesis.`,
        ],
        preventive_measures: [
          `Choose wind-firm, lodging-resistant dwarf varieties for storm-prone localities.`,
          `Construct farm ponds or rainwater harvesting structures to capture excess precipitation for subsequent dry periods.`,
        ],
        warnings: [
          `Advisories are generated based on user-reported conditions; verify with local Meteorological Department (IMD) or agromet forecasts.`,
          `Do not apply foliar sprays or granular chemicals when rain is imminent within 6 to 12 hours.`,
        ],
        follow_up_actions: [
          `Inspect the field within 12 hours after any severe weather event for drainage issues or structural crop lodging.`,
          `Apply a booster foliar micronutrient spray 3 days after weather stress to stimulate crop recovery.`,
        ],
        confidence_level: 'Moderate',
        expert_consultation_triggers: [
          `If unexpected frost or hail causes widespread mechanical injury to crops across the entire acreage.`,
          `For insurance claim filing under national crop loss insurance frameworks (e.g. PMFBY).`,
        ],
      };

    case 'harvest':
      return {
        summary: `Optimal harvest timing, maturity assessment, and post-harvest preservation for ${cleanCrop}.`,
        recommendation: `Harvest at physiological maturity when moisture content is optimal for your crop type. Conduct harvesting during dry, clear weather in the morning after dew has dried. Handle produce with care to minimize mechanical abrasions that facilitate post-harvest rot.`,
        reasoning: `Harvesting too early results in shriveled grains or unripe fruits with poor market value, while delayed harvesting leads to grain shattering, lodging, bird depredation, and field aflatoxin contamination.`,
        immediate_actions: [
          `Check physiological maturity indicators: yellowing/browning of 80% foliage, hardness of grain, or characteristic fruit color.`,
          `Sanitize harvesting sickles, crates, and storage bags before harvest operations begin.`,
          `Gradually withhold irrigation 7 to 10 days prior to harvest to facilitate uniform field drying.`,
        ],
        recommended_practices: [
          `Sun-dry grains on clean tarpaulins until moisture reaches 10-12% for safe grain storage without insect breeding.`,
          `Store dried produce in hermetic storage bags (PICS bags) or clean bins treated with inert neem leaf powder.`,
          `Pre-cool perishable fruits or vegetables in shade immediately after picking to remove field heat.`,
        ],
        risks: [
          `Aspergillus mold and aflatoxin contamination if grains are bagged at moisture levels exceeding 14%.`,
          `Post-harvest fungal rotting from bruised skin during rough transport.`,
        ],
        preventive_measures: [
          `Keep harvested produce elevated on wooden pallets; do not store directly on damp concrete floors.`,
          `Maintain good air ventilation and rodent-proof seals in storage godowns.`,
        ],
        warnings: [
          `Never store wet grains in sealed plastic bags or airtight bins without proper drying.`,
        ],
        follow_up_actions: [
          `Check stored produce weekly for signs of moisture condensation, weevil emergence, or temperature hotspots.`,
          `Analyze final grain yield and grade against your seasonal input costs.`,
        ],
        confidence_level: 'High',
        expert_consultation_triggers: [
          `If commercial cold storage or warehouse receipt financing is required for bulk marketing.`,
          `If unusual discoloration or fungal mold is observed in stored grain silos.`,
        ],
      };

    case 'crop_management':
    case 'general':
    default:
      return {
        summary: `Agronomic management and cultivation best practices for ${cleanCrop} (${cleanStage}).`,
        recommendation: `Adopt sustainable agronomic management incorporating scientific spacing, timely weed suppression, balanced nutrient top-dressing, and soil moisture monitoring. Maintain active field scouting twice a week to identify any developing stress before economic threshold levels are reached.`,
        reasoning: `Crop yield is the cumulative result of timely agronomic interventions. The critical period of weed competition is typically the first 30-40 days; keeping fields clean during this window protects 80% of yield potential.`,
        immediate_actions: [
          `Perform a comprehensive field walk in a 'W' or 'Z' pattern across your acreage to inspect general plant vigor and leaf health.`,
          `Remove noxious weeds manually or with a wheel hoe before they set flowers and seeds.`,
          `Ensure adequate soil aeration by shallow hoeing without damaging lateral root zones.`,
        ],
        recommended_practices: [
          `Follow recommended plant-to-plant and row-to-row spacing to maximize sunlight penetration and air movement.`,
          `Maintain a detailed farm logbook recording sowing dates, inputs applied, irrigation intervals, and labor costs.`,
          `Incorporate border crops (like Marigold or Maize) as trap crops for pest management.`,
        ],
        risks: [
          `Nutrient competition from rampant weed growth if inter-cultivation is delayed.`,
          `Plant lodging if excessive vegetative growth occurs without balanced potassium.`,
        ],
        preventive_measures: [
          `Use clean, well-rotted compost free of weed seeds.`,
          `Clean farm machinery before moving from an infested field to a clean plot.`,
        ],
        warnings: [
          `Advisory recommendations are guidelines to assist your farm planning and do not substitute for in-person evaluations by certified local agronomists or government extension specialists.`,
        ],
        follow_up_actions: [
          `Re-evaluate crop performance 10 days following implementation of recommended practices.`,
          `Plan next stage nutrition and protection based on crop growth calendar.`,
        ],
        confidence_level: 'High',
        expert_consultation_triggers: [
          `When experiencing sudden, unexplained crop stunting or systemic yellowing across multiple plots.`,
          `Prior to introducing new commercial crop varieties on a large scale.`,
        ],
      };
  }
};
