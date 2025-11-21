import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;

if (apiKey) {
    ai = new GoogleGenAI({ apiKey: apiKey });
}

// Simple in-memory cache to prevent re-fetching the same insight while typing back and forth
const insightCache = new Map<string, string>();

export const getPurchasingPowerInsight = async (
  countryName: string,
  localAmount: number,
  currencyCode: string
): Promise<string> => {
  // Round amount significantly to increase cache hit rate (e.g. 1,000,000 vs 1,000,050)
  // For "Millionaire" context, we only care about big picture.
  // Let's round to 2 significant digits for the prompt context.
  const approxAmount = Number(localAmount.toPrecision(2));
  const cacheKey = `${countryName}-${currencyCode}-${approxAmount}`;

  if (insightCache.has(cacheKey)) {
    return insightCache.get(cacheKey)!;
  }

  if (!ai) {
    console.warn("Gemini API Key not found.");
    return `Wealth status confirmed in ${countryName}.`;
  }

  try {
    const prompt = `
      I have approximately ${localAmount.toLocaleString()} ${currencyCode} in ${countryName}. 
      In 1 very short sentence (max 15 words), what is a fun luxury item or lifestyle perk this specific amount buys me there?
      Be witty.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text?.trim() || "Enjoy your wealth!";
    
    // Save to cache
    insightCache.set(cacheKey, text);
    
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Market data unavailable.";
  }
};