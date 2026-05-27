import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({});

export async function GET(request: NextRequest) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions for an anonymous social messaging platform like Qooh.me. These questions should be suitable for a diverse audience, focusing on universal themes that encourage friendly interaction and foster curiosity. Avoid personal or sensitive topics. Format your response as a JSON array of exactly three strings.";

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "";
    let messages: string[] = [];

    try {
      // Attempt to parse the JSON array from the response
      messages = JSON.parse(responseText);
    } catch (parseError) {
      console.error(
        "JSON parse error:",
        parseError,
        "Response was:",
        responseText
      );
      return NextResponse.json(
        { success: false, message: "Failed to parse messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error) {
    console.error("Error suggesting messages:", error);
    return NextResponse.json(
      { success: false, message: "Failed to suggest messages" },
      { status: 500 }
    );
  }
}
