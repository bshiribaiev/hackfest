import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "[SmartSave AI] GEMINI_API_KEY is not set. AI features will not work until this is configured.",
  );
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateChatJsonResponse(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }

  // NOTE: Adjust model name if needed; using Gemini 2.5 Pro as requested.
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      // Force the model to return raw JSON so our caller can parse it safely.
      responseMimeType: "application/json",
    },
  });
  const response = await result.response;
  const text = response.text();

  if (!text) {
    throw new Error("EMPTY_AI_RESPONSE");
  }

  return text;
}