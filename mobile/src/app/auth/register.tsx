import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter, Stack } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function RegisterScreen() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [invitationCode, setInvitationCode] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        if (!email || !password || !firstName || !lastName) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            // Generate a random referral code for the new user
            const userReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        full_name: `${firstName} ${lastName}`,
                        referral_code: userReferralCode,
                        invited_by: invitationCode || null,
                    },
                },
            });

            if (error) {
                Alert.alert("Error", error.message);
                return;
            }

            if (data.user) {
                Alert.alert("Success", "Account created successfully! Please verify your email.");
                router.replace("/auth/login");
            }
        } catch (e: any) {
            console.error(e);
            Alert.alert("Error", e.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black p-6">
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 justify-center">
                <Text className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Initialize</Text>
                <Text className="text-[#D9F99D] text-xs font-bold uppercase tracking-widest mb-12">New Operator Profile</Text>

                <View className="space-y-4">
                    <View className="flex-row gap-2">
                        <View className="flex-1">
                            <Text className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">First Name</Text>
                            <TextInput
                                className="bg-zinc-900 border border-white/10 text-white p-4 rounded-xl"
                                placeholder="John"
                                placeholderTextColor="#666"
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Last Name</Text>
                            <TextInput
                                className="bg-zinc-900 border border-white/10 text-white p-4 rounded-xl"
                                placeholder="Doe"
                                placeholderTextColor="#666"
                                value={lastName}
                                onChangeText={setLastName}
                            />
                        </View>
                    </View>

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

                    <View>
                        <Text className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Invitation Code (Optional)</Text>
                        <TextInput
                            className="bg-zinc-900 border border-white/10 text-white p-4 rounded-xl"
                            placeholder="INVITE-XYZ"
                            placeholderTextColor="#666"
                            autoCapitalize="characters"
                            value={invitationCode}
                            onChangeText={setInvitationCode}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleRegister}
                        disabled={loading}
                        className={`mt-8 w-full bg-white py-4 rounded-full items-center justify-center ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? <ActivityIndicator color="black" /> : (
                            <Text className="text-black font-black uppercase tracking-wider">Create Account</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/auth/login')} className="mt-4 items-center">
                        <Text className="text-white/50 text-sm">Already active? <Text className="text-white">Login</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
