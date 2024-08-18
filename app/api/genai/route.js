import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { NextResponse } from "next/server";

export async function POST(request) {
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
    const reqBody = await request.json();
    const { img } = reqBody;

    if (!img) {
      return NextResponse.json(
        { error: "No image data received" },
        { status: 400 }
      );
    }

    const prompt =
      "what iten is the person holding in the image and how many is there in the image? reply with a json format. { itemName: '_' , quantity: '_' }";
    const image = {
      inlineData: {
        data: img.split(",")[1],
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, image]);
    const msg = result.response.text();
    return NextResponse.json(msg);
  } catch (error) {
    console.error("An error occurred🔴:", error);
    return NextResponse.json(
      {
        error: "An error occurred during object detection",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
