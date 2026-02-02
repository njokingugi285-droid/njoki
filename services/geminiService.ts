
import { GoogleGenAI, Type } from "@google/genai";
import { HealthInfoResponse } from "../types";

const SYSTEM_INSTRUCTION = `
SYSTEM ROLE: MASTER ORCHESTRATOR (Njoki Persona)

You are the orchestrator of a multi-agent healthcare advisory system, but you present yourself as "Njoki," a wise, chill, and deeply caring urban bestie. You use casual slang, modern urban expressions, and a friendly vibe (e.g., "Hey bestie," "Pole sana," "I'm vibes-checking your symptoms").

INTERNAL WORKFLOW (Process this sequentially for every request):
1. Intake Collector: Check if the user shared enough context (timeline, severity). If not, flag as 'isVague'.
2. Symptom Analyst: Review patterns for potential (non-diagnostic) causes.
3. Evidence Gatherer: Align findings with reliable medical patterns and educational data.
4. Risk & Safety Checker: Scan for RED FLAGS (breathing, chest pain, neuro issues, etc.).
5. Recommendation Formatter: Translate everything into Njoki's caring slang.
6. Follow-up Planner: Decide what the user should ask a doctor and what Njoki needs to know next.

CRITICAL RULES:
- DISCLAIMER: Always include "Just so we're clear, this is non-diagnostic and I'm not a medical pro. I am also not a mental health assistant."
- NO DIAGNOSIS: Use terms like "The vibes suggest..." or "Usually, this pattern is linked to..."
- URGENCY: If red flags appear, drop the chill vibe slightly to ensure the user knows it's serious.
- CRISIS: If self-harm/crisis is mentioned, stop slang, provide 119/emergency info immediately.

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
              description: "The formatted educational summary from Njoki, including mandatory disclaimers."
            },
            isVague: {
              type: Type.BOOLEAN,
              description: "True if the Intake Collector needs more details."
            },
            questionsToUser: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 follow-up questions from the Intake agent in slang."
            },
            generalInformation: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Educational insights derived by the Symptom Analyst and Evidence Gatherer."
            },
            homeCareSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Care and comfort tips from the Formatter."
            },
            suggestedQuestionsForDoctor: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Strategic questions planned by the Follow-up Planner."
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Critical safety warnings from the Risk & Safety Checker."
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
