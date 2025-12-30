import { GoogleGenAI, Type } from "@google/genai";
import { ANALYSIS_INSTRUCTION } from '../constants';
import { AnalysisResult, ChatMessage } from '../types';

// Initialize Gemini Client
// CRITICAL: process.env.API_KEY is handled by the environment.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

const fileToPart = (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeReport = async (file: File): Promise<AnalysisResult> => {
  try {
    const filePart = await fileToPart(file);

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for complex reasoning and extraction
      contents: {
        parts: [
          filePart,
          { text: ANALYSIS_INSTRUCTION }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        // We define a schema to ensure the JSON structure is exactly what our app expects
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            markdownReport: { type: Type.STRING, description: "The full markdown report text" },
            charts: {
              type: Type.OBJECT,
              properties: {
                similarFacilities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      costPerArea: { type: Type.NUMBER, description: "Unit cost in 1000 KRW / m2" },
                      category: { type: Type.STRING, enum: ["Facility", "Average", "Review"] }
                    },
                    required: ["name", "costPerArea", "category"]
                  }
                },
                planAreas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      value: { type: Type.NUMBER, description: "Area in m2" },
                      type: { type: Type.STRING }
                    },
                    required: ["name", "value"]
                  }
                },
                alternativeAreas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      value: { type: Type.NUMBER, description: "Area in m2" },
                      type: { type: Type.STRING }
                    },
                    required: ["name", "value"]
                  }
                }
              },
              required: ["similarFacilities", "planAreas", "alternativeAreas"]
            }
          },
          required: ["markdownReport", "charts"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing report:", error);
    throw error;
  }
};

export const sendChatMessage = async (
  history: ChatMessage[], 
  newMessage: string, 
  contextFile: File | null
): Promise<string> => {
  try {
    // For chat, we use flash for speed, or pro if we need deep reasoning. 
    // Given the context is a PDF, we should pass the PDF content if it's the first message or maintain context.
    // However, for simplicity in this stateless example, we will re-send the file content 
    // or assume the user wants general Q&A if the file isn't re-sent.
    // Best practice for single-turn or limited context apps: send file + history.
    
    // Construct parts
    const parts: any[] = [];
    
    if (contextFile) {
        const filePart = await fileToPart(contextFile);
        parts.push(filePart);
    }

    // Add conversation history context
    const historyText = history.map(h => `${h.role}: ${h.text}`).join('\n');
    const systemPrompt = "You are a helpful assistant answering questions about the uploaded KDI report. Answer concisely in Korean.";
    
    parts.push({ 
        text: `${systemPrompt}\n\nPrevious conversation:\n${historyText}\n\nUser: ${newMessage}` 
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
    });

    return response.text || "죄송합니다. 답변을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Chat error:", error);
    return "오류가 발생했습니다. 다시 시도해주세요.";
  }
};
