import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter, Stack } from "expo-router";
import { supabase } from "@/lib/supabase";
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import { Chrome, Apple, Fingerprint } from "lucide-react-native";

WebBrowser.maybeCompleteAuthSession();

const redirectTo = makeRedirectUri();

const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);

    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token } = params;

    if (!access_token) return;

    const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
    });

    if (error) throw error;
    return data.session;
};

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);
        })();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter email and password.");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                Alert.alert("Error", error.message);
            } else {
                // Save password for biometric re-login if needed
                await SecureStore.setItemAsync('user_email', email);
                await SecureStore.setItemAsync('user_password', password);
                router.replace("/(tabs)/profile");
            }
        } catch (e: any) { // Type assertion for error
            Alert.alert("Error", e.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleBiometricLogin = async () => {
        const savedEmail = await SecureStore.getItemAsync('user_email');
        const savedPassword = await SecureStore.getItemAsync('user_password');

        if (!savedEmail || !savedPassword) {
            Alert.alert("Notice", "Please login with password first to enable biometrics.");
            return;
        }

        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to access Terminal',
            fallbackLabel: 'Use Password',
        });

        if (auth.success) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            // Auto-trigger login
            setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({
                email: savedEmail,
                password: savedPassword,
            });
            setLoading(false);
            if (!error) router.replace("/(tabs)/profile");
            else Alert.alert("Error", error.message);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'apple') => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo,
                    skipBrowserRedirect: true,
                },
            });

            if (error) throw error;

            const res = await WebBrowser.openAuthSessionAsync(
                data.url || "",
                redirectTo
            );

            if (res.type === "success") {
                const { url } = res;
                await createSessionFromUrl(url);
                router.replace("/(tabs)/profile");
            }
        } catch (err: any) { // Type assertion for error
            Alert.alert("Error", err.message || "OAuth failed");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black p-6">
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 justify-center">
                <Text className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Access</Text>
                <Text className="text-[#D9F99D] text-xs font-bold uppercase tracking-widest mb-12">Terminal Login</Text>

                <View className="space-y-4">
                    <View>
                        <Text className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Email</Text>
                        <TextInput
                            className="bg-zinc-900 border border-white/10 text-white p-4 rounded-xl"
                            placeholder="operator@riiqx.com"
                            placeholderTextColor="#666"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View>
                        <Text className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Password</Text>
                        <TextInput
                            className="bg-zinc-900 border border-white/10 text-white p-4 rounded-xl"
                            placeholder="••••••••"
                            placeholderTextColor="#666"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className={`mt-8 w-full bg-[#D9F99D] py-4 rounded-full items-center justify-center ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? <ActivityIndicator color="black" /> : (
                            <Text className="text-black font-black uppercase tracking-wider">Connect</Text>
                        )}
                    </TouchableOpacity>

                    {/* Biometric Button */}
                    {isBiometricSupported && (
                        <TouchableOpacity
                            onPress={handleBiometricLogin}
                            className="w-full bg-zinc-900 border border-white/10 py-4 rounded-full items-center justify-center flex-row space-x-2 mt-4"
                        >
                            <Fingerprint size={20} color="#D9F99D" />
                            <Text className="text-white font-bold uppercase tracking-wider text-xs ml-2">Unlock with Biometrics</Text>
                        </TouchableOpacity>
                    )}

                    {/* Social Login */}
                    <View className="flex-row justify-center space-x-4 mt-6">
                        <TouchableOpacity onPress={() => handleSocialLogin('google')} className="w-12 h-12 bg-white rounded-full items-center justify-center">
                            <Chrome size={24} color="black" />
                        </TouchableOpacity>
                        {Platform.OS === 'ios' && (
                            <TouchableOpacity onPress={() => handleSocialLogin('apple')} className="w-12 h-12 bg-white rounded-full items-center justify-center">
                                <Apple size={24} color="black" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity onPress={() => router.push('/auth/register')} className="mt-8 items-center">
                        <Text className="text-white/50 text-sm">New Operator? <Text className="text-[#D9F99D]">Request Clearance</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
