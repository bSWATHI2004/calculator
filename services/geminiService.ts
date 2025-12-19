
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, RiskLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    riskScore: {
      type: Type.NUMBER,
      description: "A numeric score from 0 (Safe) to 100 (Extremely Dangerous).",
    },
    riskLevel: {
      type: Type.STRING,
      description: "One of: LOW, MEDIUM, HIGH, CRITICAL",
    },
    summary: {
      type: Type.STRING,
      description: "A concise 2-sentence summary of the overall assessment.",
    },
    redFlags: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          description: { type: Type.STRING },
          severity: { type: Type.STRING },
        },
        required: ["category", "description", "severity"]
      },
    },
    senderAnalysis: {
      type: Type.STRING,
      description: "Analysis of the sender's email address or claimed identity.",
    },
    linkAnalysis: {
      type: Type.STRING,
      description: "Assessment of any links or attachments mentioned.",
    },
    toneAnalysis: {
      type: Type.STRING,
      description: "Analysis of the language, urgency, and emotional manipulation.",
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3-4 actionable steps for the user.",
    }
  },
  required: [
    "riskScore", 
    "riskLevel", 
    "summary", 
    "redFlags", 
    "senderAnalysis", 
    "linkAnalysis", 
    "toneAnalysis", 
    "recommendations"
  ]
};

export const analyzeEmail = async (emailContent: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analyze the following email content for potential security risks, scams, phishing, or fraud. Be thorough and cynical.
      
      EMAIL CONTENT:
      """
      ${emailContent}
      """`,
      config: {
        systemInstruction: "You are a world-class cybersecurity expert specializing in email fraud detection (phishing, BEC, spoofing, advance-fee scams). Your task is to provide structural analysis of user-provided emails and return precise risk assessments.",
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        temperature: 0.1, // High precision for analysis
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    return JSON.parse(resultText) as AnalysisResult;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw error;
  }
};
