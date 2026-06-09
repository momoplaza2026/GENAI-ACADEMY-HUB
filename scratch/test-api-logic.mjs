import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

// Curated courses mock
const CURATED_COURSES = [
  {
    id: "yt-karpathy-nn",
    title: "Neural Networks: Zero to Hero",
    creator: "Andrej Karpathy",
    platform: "YouTube",
    type: "free",
    url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
    description: "Build neural networks from scratch in code.",
  }
];

function getApiKey() {
  try {
    const envPaths = [
      path.join(process.cwd(), ".env.local"),
      path.join(process.cwd(), "apps", "web", ".env.local"),
      path.join(process.cwd(), "..", ".env.local")
    ];
    
    for (const p of envPaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf8");
        const match = content.match(/GEMINI_API_KEY\s*=\s*(.*)/);
        if (match && match[1]) {
          const key = match[1].trim().replace(/['"]/g, "");
          if (key) return key;
        }
      }
    }
  } catch (err) {
    console.warn("Could not read API key dynamically:", err);
  }
  return process.env.GEMINI_API_KEY;
}

async function runTest() {
  const query = "rag";
  const apiKey = getApiKey();
  console.log("API Key loaded successfully:", apiKey ? `${apiKey.substring(0, 8)}...` : "None");
  
  if (!apiKey) {
    console.error("Error: GEMINI_API_KEY not found!");
    return;
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a Course Recommendation engine for the GenAI Academy & Hub.
The user is searching for educational courses (YouTube, Coursera, Udemy, etc.) about: "${query}".
Generate exactly 4 highly relevant, realistic, and high-quality courses for this topic (2 free YouTube videos/playlists, and 2 paid Coursera/Udemy/edX/DeepLearning.AI courses).

Return ONLY a valid JSON array of Course objects matching this TypeScript interface structure:
interface Course {
  id: string; // e.g. "dyn-yt-rag-1", "dyn-coursera-rag-2"
  title: string;
  creator: string;
  platform: 'YouTube' | 'Coursera' | 'Udemy' | 'edX' | 'DeepLearning.AI';
  type: 'free' | 'paid';
  url: string; // MUST be a realistic URL. If the exact URL is unknown, use search-based links like:
               // - YouTube: https://www.youtube.com/results?search_query=topic_name
               // - Coursera: https://www.coursera.org/search?query=topic_name
               // - Udemy: https://www.udemy.com/courses/search/?q=topic_name
  description: string;
}

Do NOT wrap the output in markdown block (like \`\`\`json ... \`\`\`). Return ONLY the raw JSON string.`;

    console.log("Sending prompt to Gemini...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    if (response && response.text) {
      console.log("Response text received:\n", response.text);
      let cleanJson = response.text.trim();
      const jsonMatch = cleanJson.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        cleanJson = jsonMatch[0];
      }
      
      const dynamicCourses = JSON.parse(cleanJson);
      console.log("Parsed dynamic courses successfully! Count:", dynamicCourses.length);
      console.dir(dynamicCourses, { depth: null });
    } else {
      console.error("Error: Empty response from Gemini!");
    }
  } catch (e) {
    console.error("Test failed with error:", e);
  }
}

runTest();
