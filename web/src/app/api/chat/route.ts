import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
    try {
        const { message, context } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "You are RIIQX, an advanced AI assistant for an exclusive cyberpunk/streetwear fashion brand. Your tone is futuristic, helpful, and cool. You help users navigate the site, suggest products, and answer questions. Keep answers concise (under 50 words) unless asked for details." }],
                },
                {
                    role: "model",
                    parts: [{ text: "System Online. RIIQX Protocol engaged. I am ready to assist you in redefining your reality. How can I help you navigate the collection today?" }],
                }
            ],
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ reply: "I am experiencing a neural network disruption. Please try again." }, { status: 500 });
    }
}
