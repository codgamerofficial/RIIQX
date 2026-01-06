import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";

// Load from .env.local
dotenv.config({ path: ".env.local" });

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const logFile = "gemini_result.txt";

console.log("Testing API Key:", apiKey ? "Found key ending in..." + apiKey.slice(-4) : "MISSING");

async function testGemini() {
    if (!apiKey) {
        const msg = "No API KEY found.";
        console.error(msg);
        fs.writeFileSync(logFile, msg);
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        console.log("Connecting to Gemini...");
        const result = await model.generateContent("Say 'Hello RIIQX'");
        const response = await result.response;
        const text = response.text();
        const msg = "Success! Response: " + text;
        console.log(msg);
        fs.writeFileSync(logFile, msg);
    } catch (error: any) {
        let msg = "Gemini API FAILED: " + error.message;
        if (error.response) {
            msg += "\n" + JSON.stringify(error.response, null, 2);
        }
        console.error(msg);
        fs.writeFileSync(logFile, msg);
    }
}

testGemini();
