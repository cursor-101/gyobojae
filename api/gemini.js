import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { contents } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing on server",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      generationConfig: { responseMimeType: "application/json" },
    });

    return res.status(200).json({
      text: result.text, // 그대로 프론트로 전달
    });
  } catch (error) {
    console.error("Gemini Server Error:", error);
    return res.status(500).json({
      error: error.message,
    });
  }
}