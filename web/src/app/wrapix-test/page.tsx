"use client";

import { useNativeBridge } from "@/hooks/useNativeBridge";
import { useState } from "react";

export default function WrapixTestPage() {
    const { isNative, showToast, requestLocation, authenticateUser, getFCMToken } = useNativeBridge();
    const [logs, setLogs] = useState<string[]>([]);
    const [location, setLocation] = useState<string | null>(null);
    const [fcmToken, setFcmToken] = useState<string | null>(null);

    const addLog = (msg: string) => setLogs((prev) => [msg, ...prev]);

    const handleLocation = async () => {
        addLog("Requesting Location...");
        try {
            const loc = await requestLocation();
            setLocation(`Lat: ${loc.lat}, Lng: ${loc.lng}`);
            addLog(`Location: ${loc.lat}, ${loc.lng}`);
            showToast("Location Received!");
        } catch (e: any) {
            addLog(`Location Error: ${e}`);
            showToast(`Location Error: ${e}`);
        }
    };

    const handleBiometric = async () => {
        addLog("Requesting Biometric Auth...");
        try {
            const success = await authenticateUser();
            if (success) {
                addLog("Biometric: SUCCESS");
                showToast("Biometric Verified ✅");
            } else {
                addLog("Biometric: FAILED");
                showToast("Biometric Failed ❌");
            }
        } catch (e: any) {
            addLog(`Biometric Error: ${e}`);
        }
    };

    const handleFCM = async () => {
        addLog("Getting FCM Token...");
        const token = await getFCMToken();
        setFcmToken(token);
        addLog(`FCM Token: ${token.substring(0, 10)}...`);
    };

    return (
        <div className="p-6 max-w-md mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Wrapix Integration Test</h1>

            <div className="p-4 bg-gray-100 rounded-lg">
                <p><strong>Environment:</strong> {isNative ? "✅ Native App" : "🌐 Web Browser"}</p>
            </div>

            <div className="space-y-4">
                <button
                    onClick={() => showToast("Hello from React!")}
                    className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Test Toast
                </button>

                <button
                    onClick={handleLocation}
                    className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Get GPS Location
                </button>
                {location && <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{location}</p>}

                <button
                    onClick={handleBiometric}
                    className="w-full p-3 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                    Test Biometric Login
                </button>

                <button
                    onClick={handleFCM}
                    className="w-full p-3 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                    Get FCM Token
                </button>
                {fcmToken && <p className="text-xs break-all bg-gray-50 p-2 rounded">{fcmToken}</p>}
            </div>

            <div className="border-t pt-4">
                <h2 className="font-semibold mb-2">Logs:</h2>
                <div className="bg-black text-green-400 p-3 rounded h-40 overflow-y-auto text-xs font-mono">
                    {logs.map((log, i) => (
                        <div key={i}>&gt; {log}</div>
                    ))}
                    {logs.length === 0 && <div className="text-gray-500">No logs yet...</div>}
                </div>
            </div>
        </div>
    );
}
