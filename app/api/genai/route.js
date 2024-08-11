import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

export async function POST(req, res) {
  // Initialize GoogleGenerativeAI with your API_KEY.
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  // Choose a Gemini model.
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  // Initialize GoogleAIFileManager with your API_KEY.
  const fileManager = new GoogleAIFileManager(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY
  );

  try {
    const reqBody = await req.json();
    const { img } = reqBody;

    const prompt = "what is in this image?";
    const image = {
      inlineData: {
        data: img.split(",")[1],
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, image]);
    console.log(`this is the output: ${result.response.text()}`);

    res.json({ output: result.response.text() });
  } catch (error) {
    console.error("An error occurred🔴:", error);
    res.json({ error: "An error occurred while processing your request." });
  }
}
