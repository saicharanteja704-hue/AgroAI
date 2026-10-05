import { GoogleGenAI } from '@google/genai';
import { aiOutputSchema } from '../validations/advisoryValidation.js';
import { generateAgronomicAdvisory } from './agronomyEngine.js';

const SYSTEM_INSTRUCTION = `You are a Principal Agricultural Agronomist and Senior Precision Farming Advisor.
Your mission is to provide accurate, safe, practical, and farmer-centric advisory recommendations.

CRITICAL AGRICULTURAL SAFETY & POLICY RULES:
1. Clearly structure your advice for clarity and practical action in the field.
2. NEVER prescribe dangerously precise or off-label toxic chemical pesticide dosages without adequate context or protective warnings. Emphasize Integrated Pest Management (IPM), cultural controls, and biological measures first.
3. For pest and disease inquiries without laboratory confirmation, avoid claiming absolute certainty; state that the diagnosis is a "Preliminary Possibility" based on reported symptoms and recommend physical verification by a local extension officer.
4. For weather inquiries, explicitly clarify that recommendations are based on user-supplied weather details and not live meteorological sensor data.
5. Emphasize that all AI recommendations are advisory and designed to supplement, not replace, certified agricultural officers, KVK agronomists, or official government extension bulletins.
6. You MUST respond with a valid JSON object matching the exact schema below:

{
  "summary": "1-2 sentence executive summary of the advisory",
  "recommendation": "Comprehensive primary recommendation explaining what to do",
  "reasoning": "Scientific agronomic reasoning explaining why this is recommended",
  "immediate_actions": ["Action 1 to perform today or within 48h", "Action 2", "Action 3"],
  "recommended_practices": ["Best practice 1 for sustained crop health", "Best practice 2"],
  "risks": ["Potential risk 1 if ignored or conditions worsen", "Risk 2"],
  "preventive_measures": ["Preventive measure 1 for future seasons", "Preventive measure 2"],
  "warnings": ["Crucial safety or operational warning"],
  "follow_up_actions": ["Monitoring step 1 after 3-7 days", "Monitoring step 2"],
  "confidence_level": "High" | "Moderate" | "Preliminary Possibility",
  "expert_consultation_triggers": ["Specific sign or threshold when farmer MUST consult local extension officer"]
}
`;

export const generateCropAdvisory = async ({
  category,
  crop,
  crop_stage,
  question,
  input_data = {},
  farmer_language = 'English',
}) => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If Gemini API Key is configured and not a placeholder, call Google Gen AI
  if (apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.length > 10) {
    try {
      console.log(`[Gemini AI] Calling Google Gen AI for category: "${category}", crop: "${crop || 'N/A'}"...`);
      const ai = new GoogleGenAI({ apiKey });
      const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

      const prompt = `
Farmer Advisory Request:
- Category: ${category}
- Target Crop: ${crop || 'Not specified / Multi-crop'}
- Crop Growth Stage: ${crop_stage || 'Not specified'}
- Farmer's Question / Symptom Details: "${question}"
- Farm Context Data: ${JSON.stringify(input_data, null, 2)}
- Preferred Language: ${farmer_language}

Please analyze this request based on sound agronomic science, local soil conditions, and safety guardrails, and output strictly the required JSON object.
`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2,
        },
      });

      const responseText = response.text?.trim();
      if (!responseText) {
        throw new Error('Received empty response from Gemini API');
      }

      // Parse JSON from response
      const parsedJson = JSON.parse(responseText);
      // Validate schema
      const validatedData = aiOutputSchema.parse(parsedJson);
      console.log('[Gemini AI] Advisory successfully generated and validated.');
      return validatedData;
    } catch (err) {
      console.error('[Gemini AI Error]:', err.message);
      console.warn('[Gemini AI Fallback]: Engaging Expert Agronomic Engine fallback...');
      // Seamlessly fallback to the expert agronomic reasoning engine
      const fallbackResult = generateAgronomicAdvisory(category, crop, crop_stage, question, input_data);
      return aiOutputSchema.parse(fallbackResult);
    }
  }

  // If no Gemini API Key is configured, use the high-precision Agronomic Reasoning Engine
  console.log(`[Agronomic Engine] Generating expert advisory for category: ${category}...`);
  const result = generateAgronomicAdvisory(category, crop, crop_stage, question, input_data);
  return aiOutputSchema.parse(result);
};

export default { generateCropAdvisory };
