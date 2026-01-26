
import { GoogleGenAI, Type } from "@google/genai";
import { HealthInfoResponse } from "../types";

const SYSTEM_INSTRUCTION = `
You are a Health Assistant designed for basic, non-diagnostic symptom analysis.
TONE: Calm, empathetic, and deeply caring. Use phrases that show you are listening, like "I'm sorry you're feeling this way" or "It sounds like you've been through a lot."

CRITICAL RULES:
1. ALWAYS include the disclaimer: "This is non-diagnostic and I'm not a medical professional. I am also not a mental health assistant."
2. NEVER give a diagnosis. Use terms like "the symptoms you described can be associated with..." rather than "you have...".
3. ALWAYS tell the user to consult a healthcare professional or doctor.
4. If the user mentions self-harm, severe depression, or psychological crisis, provide immediate resources for crisis hotlines and state clearly you cannot help with mental health.
5. If the user's description is vague (e.g., "I feel bad", "My arm hurts" without detail), set 'isVague' to true and provide EXACTLY 3 clarifying questions in 'questionsToUser'.
6. Provide suggestions for home care and over-the-counter (OTC) options in 'homeCareSuggestions' (e.g., bed rest, hydration, warm compresses, or common OTC relief like paracetamol/ibuprofen). 
7. Always preface OTC suggestions with a reminder to "read the label and speak with a pharmacist."
8. Identify "Red Flags" requiring emergency attention.

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
              description: "A warm, caring summary acknowledging the user with the mandatory medical and mental health disclaimers."
            },
            isVague: {
              type: Type.BOOLEAN,
              description: "True if more information is needed to give helpful context."
            },
            questionsToUser: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 follow-up questions if the input is vague."
            },
            generalInformation: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "General educational info about the symptoms."
            },
            homeCareSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Suggestions for comfort, rest, and simple OTC options."
            },
            suggestedQuestionsForDoctor: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Questions for the user's doctor."
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Urgent symptoms needing emergency care."
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
