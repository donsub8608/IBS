import { GoogleGenAI } from "@google/genai";

// Note: As this is a frontend simulation, we cannot securely store an API key.
// We are assuming process.env.API_KEY is populated by the execution environment.
// In a real application, this call would be made from a backend server.
let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
} catch (error) {
  console.error("Gemini API key not found or invalid. OCR functionality will be disabled.", error);
}

/**
 * Performs OCR on a base64 encoded image using the Gemini API.
 * @param base64Image - A base64 encoded string of the image (without the data URL prefix).
 */
export const getOcrFromImage = async (base64Image: string): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized. Check API Key.");
  }

  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/png',
        data: base64Image,
      },
    };
    const textPart = {
      text: "Extract all numbers, values, and units of measurement from this image. Be precise and return only the extracted text. If multiple readings are present, separate them with a comma. If no text is clearly legible, respond with 'N/A'.",
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction: "You are an AI assistant specialized in high-accuracy Optical Character Recognition (OCR) on images from industrial environments. Your task is to read text from gauges, digital readouts, and labels."
        }
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a response from the AI model.");
  }
};
