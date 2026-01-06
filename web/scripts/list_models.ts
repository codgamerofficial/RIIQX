import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const logFile = "gemini_models_result.txt";

// Note: The SDK does not expose listModels directly on the main class easily in all versions.
// We will use raw fetch to call the API directly to be sure.

async function listModels() {
    if (!apiKey) {
        fs.writeFileSync(logFile, "No API Key");
        return;
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        let output = "";
        if (data.models) {
            output = "Available Models:\n" + data.models.map((m: any) => m.name).join("\n");
        } else {
            output = "Error listing models: " + JSON.stringify(data, null, 2);
        }

        console.log(output);
        fs.writeFileSync(logFile, output);
    } catch (e: any) {
        fs.writeFileSync(logFile, "Fetch Error: " + e.message);
    }
}

listModels();
