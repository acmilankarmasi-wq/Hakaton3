// @ts-ignore
import { GoogleGenAI } from "@google/genai";
import { Student, LanguageCode } from "../types";

// Global declarations for Node.js environment
declare const process: any;

// Safe access to process.env for browser environments
// @ts-ignore
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeFinancialHealth = async (students: Student[], language: LanguageCode): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure your environment variables.";
  }

  try {
    // Prepare data summary for the AI using correct LoanRecord properties
    const dataSummary = students.map(s => 
      `- Loan: ${s.title} (${s.category}): Monthly Income $${s.monthlyIncome}, Loan Amount $${s.amount}`
    ).join('\n');

    const prompt = `
      Analyze the following student loan portfolio for a single user. 
      Provide a concise executive summary of their financial health.
      Identify if the Debt-to-Income ratio is concerning (annualized income vs total debt).
      Provide 3 actionable recommendations for managing these specific loans.
      
      Data:
      ${dataSummary}
      
      IMPORTANT: Respond fully in ${language}.
      Format the output in Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are a senior financial advisor for university students using the EduEasy app. Be professional, empathetic, and data-driven. Always answer in ${language}.`,
      }
    });

    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Failed to generate financial insights. Please try again later.";
  }
};

export const getSupportResponse = async (message: string, language: LanguageCode, financialContext?: string): Promise<string> => {
  if (!apiKey) {
    return "I'm sorry, I cannot connect to the server right now (API Key missing).";
  }

  try {
    const prompt = `
      User Message: "${message}"
      
      ${financialContext ? `User's Current Financial Data: \n${financialContext}` : ''}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are a proactive and helpful financial assistant for the 'EduEasy' app. 
        If the user provides financial context, give PERSONALIZED advice (e.g., "Yes, you can afford that based on your income").
        If no context is provided, help with app features (Dashboard, Loans, Budgeting).
        Keep answers short, friendly, and helpful. ALWAYS respond in ${language}.`,
      }
    });

    return response.text || "I didn't catch that. Could you rephrase?";
  } catch (error) {
    console.error("Error in support chat:", error);
    return "I'm having trouble thinking right now. Please try again.";
  }
};