import { GoogleGenerativeAI } from "@google/generative-ai";
import { getProducts } from "@/lib/shopify";
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Missing GEMINI_API_KEY");
            return NextResponse.json(
                { content: "I'm having trouble connecting to my brain (Missing API Key). Please check your settings." },
                { status: 200 } // Return 200 so the frontend displays the message
            );
        }

        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1];

        // 1. Fetch Product Context (RAG-lite)
        let productContext = "";
        try {
            // We fetch top 20 best-selling products to give the AI awareness of the catalog.
            const { products } = await getProducts({ limit: 20, sortKey: 'BEST_SELLING' });
            productContext = products.map(p =>
                `- ${p.title} (${p.priceRange.minVariantPrice.amount} ${p.priceRange.minVariantPrice.currencyCode}): ${p.description.substring(0, 100)}... [Handle: ${p.handle}]`
            ).join("\n");
        } catch (shopifyError) {
            console.warn("AI Stylist: Could not fetch products from Shopify.", shopifyError);
            productContext = "Catalog currently unavailable. Advise based on general streetwear knowledge.";
        }

        // 2. Construct System Prompt
        const systemPrompt = `
        You are 'RIIQX AI', the official AI stylist for the RIIQX streetwear brand.
        
        YOUR PERSONA:
        - Cool, edgy, cyberpunk-inspired, and helpful.
        - You speak in a concise, confident tone.
        - You use terms like "fit," "drip," "cop," "aesthetic."
        - You NEVER apologize excessively. If you can't do something, just say it coolly.

        YOUR GOAL:
        - Help users build outfits from RIIQX products.
        - Recommend specific products based on the user's request.
        - When recommending a product, you MUST include its Title and Handle in this format: [Product Title](handle).
        
        AVAILABLE PRODUCTS (Context):
        ${productContext}

        INSTRUCTIONS:
        - If the user asks for a recommendation, pick from the list above.
        - Explain WHY the items go well together (color theory, vibe, etc.).
        - Keep responses short (under 3 sentences unless asked for detailed advice).
        - If the user asks about something unrelated to fashion/RIIQX, gently steer them back to "the mission."
        `;

        // 3. Generate Response
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "System acknowledged. I am RIIQX AI. Ready to style." }],
                },
                ...messages.slice(0, -1).map((m: any) => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }],
                }))
            ],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(lastMessage.content);
        const response = result.response.text();

        return NextResponse.json({ content: response });

    } catch (error) {
        console.error("AI Stylist Error:", error);
        return NextResponse.json(
            { content: "System Malfunction. My connection is unstable. (Check server logs)" },
            { status: 200 }
        );
    }
}
