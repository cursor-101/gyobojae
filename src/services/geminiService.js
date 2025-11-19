import { getServerSpecPrompt, getApiUsagePrompt, getReviewPrompt } from '../prompts';

// 파일 → base64 변환
const fileToGenerativePart = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => 
      resolve({
        inlineData: {
          mimeType: file.type,
          data: reader.result.split(",")[1],
        },
      });
    reader.onerror = (error) => reject(error);
  });
};

const callGeminiServer = async (contents) => {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents }),
  });

  const data = await response.json();

  if (data.error) {
    return { status: "error", message: data.error };
  }

  // Gemini response.text 안에 JSON이 포함됨
  const rawText = data.text;
  const startIndex = rawText.indexOf("{");
  const endIndex = rawText.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1) {
    return { status: "error", message: "Invalid JSON in AI response" };
  }

  const jsonString = rawText.substring(startIndex, endIndex + 1);
  return JSON.parse(jsonString);
};

export const estimateServerSpec = async (planText, file) => {
  const prompt = getServerSpecPrompt(planText);

  const parts = [{ text: prompt }];

  if (file) {
    const filePart = await fileToGenerativePart(file);
    parts.push({ text: "\n\n첨부된 계획서 파일:" });
    parts.push(filePart);
  }

  return callGeminiServer([{ parts }]);
};

export const estimateApiUsage = async (planText, file) => {
  const prompt = getApiUsagePrompt(planText);

  const parts = [{ text: prompt }];

  if (file) {
    const filePart = await fileToGenerativePart(file);
    parts.push({ text: "\n\n첨부된 계획서 파일:" });
    parts.push(filePart);
  }

  return callGeminiServer([{ parts }]);
};

export const reviewApplicationReasons = async (items) => {
  const prompt = getReviewPrompt(items);
  return callGeminiServer([{ parts: [{ text: prompt }] }]);
};


// // src/services/geminiService.js
// import { GoogleGenAI } from "@google/genai";
// import { getServerSpecPrompt, getApiUsagePrompt, getReviewPrompt } from '../prompts';

// const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// if (!API_KEY) {
//   console.error("Gemini API Key is missing. Please add REACT_APP_GEMINI_API_KEY to your .env file.");
// }

// // Initialize with API key as per the user's example
// const ai = new GoogleGenAI({ apiKey: API_KEY });

// // Helper function to convert a File object to a GoogleGenerativeAI.Part object.
// const fileToGenerativePart = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve({ inlineData: { mimeType: file.type, data: reader.result.split(',')[1] } });
//     reader.onerror = (error) => reject(error);
//   });
// };

// /**
//  * A generic function to call the Gemini API.
//  * @param {Array<string|object>} contents The array of content parts (text, inlineData).
//  * @returns {Promise<any>} The parsed JSON response from the API.
//  */
// const generateContent = async (contents) => {
//   if (!API_KEY) {
//     return { status: 'error', message: 'Gemini API key is not configured.' };
//   }
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: contents,
//       generationConfig: { responseMimeType: "application/json" },
//     });
    
//     const rawText = response.text;
//     const startIndex = rawText.indexOf('{');
//     const endIndex = rawText.lastIndexOf('}');
    
//     if (startIndex === -1 || endIndex === -1) {
//       throw new Error("No valid JSON object found in the AI response.");
//     }
    
//     const jsonString = rawText.substring(startIndex, endIndex + 1);
//     return JSON.parse(jsonString);

//   } catch (error) {
//     console.error("Error calling Gemini API or parsing response:", error);
//     const parsedError = JSON.parse(error.message)?.error
//     return { status: 'error', message: parsedError?.message, code: parsedError?.code };
//   }
// };

// export const estimateServerSpec = async (planText, file) => {
//   const prompt = getServerSpecPrompt(planText);
//   const parts = [{ text: prompt }];
//   if (file) {
//     const filePart = await fileToGenerativePart(file);
//     parts.push({ text: "\n\n첨부된 계획서 파일:" });
//     parts.push(filePart);
//   }
//   return generateContent([{ parts }]);
// };

// export const estimateApiUsage = async (planText, file) => {
//   const prompt = getApiUsagePrompt(planText);
//   const parts = [{ text: prompt }];
//   if (file) {
//     const filePart = await fileToGenerativePart(file);
//     parts.push({ text: "\n\n첨부된 계획서 파일:" });
//     parts.push(filePart);
//   }
//   return generateContent([{ parts }]);
// };

// export const reviewApplicationReasons = async (items) => {
//   const prompt = getReviewPrompt(items);
//   const parts = [{ text: prompt }];
//   return generateContent([{ parts }]);
// };
