
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a unique anonymous identity using Gemini 3.
 */
export const generateAnonymousIdentity = async (): Promise<{ username: string; motto: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a cool anonymous username starting with 'u_' (max 12 chars) and a short hacker-style bio. Be creative but minimalist.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            username: { type: Type.STRING },
            motto: { type: Type.STRING },
          },
          required: ["username", "motto"],
        },
      },
    });
    return JSON.parse(response.text || '{"username": "u_ANON", "motto": "Tracing the signal."}');
  } catch (error) {
    console.error("Identity generation failed", error);
    return { username: `u_USER_${Math.floor(Math.random()*999)}`, motto: "Archiving thoughts." };
  }
};

/**
 * Extracts interest tags for profile personalization in the background.
 */
export const extractInterests = async (content: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract up to 3 short interest tags from this text: "${content}". Output only a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch {
    return [];
  }
};
