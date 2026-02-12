"use client";

import { useEffect, useState } from "react";

// Define the Android Interface
declare global {
    interface Window {
        Android?: {
            showToast: (message: String) => void;
            requestLocation: () => void;
            authenticateUser: () => void;
            saveData: (key: string, value: string) => void;
            getData: (key: string) => string | null;
            clearData: (key: string) => void;
            getFCMToken: () => void;
        };
        // Callbacks called by Android
        onLocationReceived?: (json: string) => void;
        onLocationError?: (error: string) => void;
        onBiometricSuccess?: (message: string) => void;
        onBiometricError?: (error: string) => void;
        onBiometricFailed?: () => void;
        onFCMTokenReceived?: (token: string) => void;
    }
}

export const useNativeBridge = () => {
    const [isNative, setIsNative] = useState(false);

    useEffect(() => {
        setIsNative(!!window.Android);
    }, []);

    // --- Wrappers ---

    const showToast = (message: string) => {
        if (window.Android) {
            window.Android.showToast(message);
        } else {
            console.log("Native Toast:", message);
            // alert(message); // Fallback for web (optional)
        }
    };

    const requestLocation = (): Promise<{ lat: number, lng: number }> => {
        return new Promise((resolve, reject) => {
            if (window.Android) {
                // Setup global callbacks
                window.onLocationReceived = (jsonStr) => {
                    try {
                        const data = JSON.parse(jsonStr);
                        resolve({ lat: data.latitude, lng: data.longitude });
                    } catch (e) {
                        reject("Invalid JSON from Android");
                    }
                };
                window.onLocationError = (error) => reject(error);

                // Call native
                window.Android.requestLocation();
            } else {
                // Fallback to Web Geolocation API
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                        (err) => reject(err.message)
                    );
                } else {
                    reject("Geolocation not supported");
                }
            }
        });
    };

    const authenticateUser = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            if (window.Android) {
                window.onBiometricSuccess = () => resolve(true);
                window.onBiometricError = (err) => reject(err);
                window.onBiometricFailed = () => resolve(false); // Failed but not error
                window.Android.authenticateUser();
            } else {
                // Mock for web dev
                const success = confirm("Simulating Biometric Auth. Click OK to pass.");
                if (success) resolve(true);
                else resolve(false);
            }
        });
    };

    const getFCMToken = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (window.Android) {
                window.onFCMTokenReceived = (token) => resolve(token);
                window.Android.getFCMToken();
            } else {
                console.log("FCM not available on web (unless configured with SW)");
                resolve("web-mock-token");
            }
        });
    };

    return {
        isNative,
        showToast,
        requestLocation,
        authenticateUser,
        getFCMToken
    };
};
