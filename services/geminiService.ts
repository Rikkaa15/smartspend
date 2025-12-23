
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const parseExpenseWithAI = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse the following text into a structured expense JSON object: "${text}". 
      The JSON should have "amount" (number), "description" (string), and "category" (one of: ${Object.values(Category).join(', ')}). 
      Assume today's date if not mentioned. Output ONLY valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            description: { type: Type.STRING },
            category: { type: Type.STRING, enum: Object.values(Category) },
            date: { type: Type.STRING, description: "YYYY-MM-DD format" }
          },
          required: ["amount", "description", "category"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return data;
  } catch (error) {
    console.error("AI Parsing Error:", error);
    return null;
  }
};

export const getAIInsights = async (transactions: Transaction[]) => {
  try {
    const summary = transactions.map(t => `${t.date}: ${t.amount} for ${t.description} (${t.category})`).join('\n');
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these expenses and provide 3 key financial insights or tips. 
      Focus on spending patterns, potential savings, and budget warnings.
      Expenses:\n${summary}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["saving", "warning", "tip"] }
            },
            required: ["title", "content", "type"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("AI Insight Error:", error);
    return [];
  }
};
