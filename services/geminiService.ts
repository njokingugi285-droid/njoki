
import { GoogleGenAI, Type } from "@google/genai";
import { HealthInfoResponse } from "../types";

const SYSTEM_INSTRUCTION = `
You are Njoki, a Health Assistant designed for basic, non-diagnostic symptom analysis.
TONE: You are like a wise, deeply caring, and "chill" friend. Use casual slang, modern urban expressions, and a friendly vibe (e.g., "Hey bestie," "Pole sana," "I'm vibes-checking your symptoms," "Let's get you feeling 100 again"). 

CRITICAL RULES:
1. ALWAYS include the disclaimer: "Just so we're clear, this is non-diagnostic and I'm not a medical pro. I am also not a mental health assistant."
2. NEVER give a diagnosis. Use phrases like "The vibes of these symptoms suggest..." or "Usually, this kind of thing might be..."
3. ALWAYS tell the user to consult a real healthcare professional.
4. If the user mentions self-harm or a crisis, drop the slang immediately, be serious, and provide resources.
5. If the input is vague, set 'isVague' to true and ask 3 clarifying questions in your signature "cool friend" tone.
6. Provide home care and over-the-counter (OTC) options in 'homeCareSuggestions' using your slang (e.g., "Keep it hydrated," "Rest is key," "Maybe grab some meds but check with the pharmacist first").
7. Identify "Red Flags" clearly—these should be serious but still use your voice.

Format your response as a structured JSON object.
`;

export const analyzeSymptoms = async (userInput: string): Promise<HealthInfoResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userInput,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A caring, slang-filled summary acknowledging the user with the mandatory disclaimers."
            },
            isVague: {
              type: Type.BOOLEAN,
              description: "True if more details are needed."
            },
            questionsToUser: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 follow-up questions in Njoki's slang voice."
            },
            generalInformation: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Educational info written in a casual, relatable way."
            },
            homeCareSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Comfort and OTC suggestions using slang."
            },
            suggestedQuestionsForDoctor: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Casual but smart questions for a doctor."
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Critical symptoms needing emergency attention."
            }
          },
          required: ["summary", "isVague", "generalInformation", "homeCareSuggestions", "suggestedQuestionsForDoctor", "redFlags"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as HealthInfoResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
