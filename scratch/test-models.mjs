import { GoogleGenAI } from "@google/genai";

const key = "AIzaSyBSyIqJWHmrl0FqIFnX7MZMxTlmKRZzHJc";
const ai = new GoogleGenAI({ apiKey: key });

const models = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-3.5-flash"
];

async function checkModel(model) {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: "Say 'Hello' only.",
    });
    console.log(`[+] ${model}: SUCCESS -> "${response.text?.trim()}"`);
    return true;
  } catch (err) {
    console.log(`[-] ${model}: FAILED -> ${err.message}`);
    return false;
  }
}

async function run() {
  for (const m of models) {
    await checkModel(m);
  }
}

run();
