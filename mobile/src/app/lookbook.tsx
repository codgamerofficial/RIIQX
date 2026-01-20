import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Stack, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const LOOKS = [
    {
        id: 1,
        // Reuse assets
        image: require("../../assets/marketing/hero-future.png"),
        title: "Future Ready",
        season: "Summer '26",
        height: 300
    },
    {
        id: 2,
        image: require("../../assets/marketing/design-02.png"),
        title: "Street Ops",
        season: "Core",
        height: 300
    },
    {
        id: 3,
        image: require("../../assets/marketing/hero-bold.png"),
        title: "Bold Edition",
        season: "Essentials",
        height: 350
    },
    {
        id: 4,
        image: require("../../assets/marketing/design-01.png"),
        title: "Wear Your Story",
        season: "Campaign",
        height: 250
    },
    {
        id: 5,
        image: require("../../assets/marketing/design-03.png"),
        title: "New Arrivals",
        season: "Drops",
        height: 280
    },
    {
        id: 6,
        image: require("../../assets/marketing/design-04.png"),
        title: "Fearless",
        season: "Promo",
        height: 300
    },
];

export default function LookbookScreen() {
    return (
        <SafeAreaView className="flex-1 bg-black">
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-6 py-4 flex-row items-center justify-between border-b border-white/10">
                <Link href=".." asChild>
                    <TouchableOpacity>
                        <ArrowLeft color="white" size={24} />
                    </TouchableOpacity>
                </Link>
                <Text className="text-white font-black uppercase tracking-widest text-lg">Lookbook</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View className="mb-8 items-center">
                    <Text className="text-white/60 text-center text-sm mb-2 uppercase tracking-widest">Season 2026</Text>
                    <Text className="text-white text-3xl font-black text-center uppercase leading-tight">
                        Visual <Text className="text-[#D9F99D]">Manifesto</Text>
                    </Text>
                </View>

                <View className="flex-row flex-wrap justify-between">
                    {/* Simplified split by index for masonry effect */}
                    <View style={{ width: '48%' }}>
                        {LOOKS.filter((_, i) => i % 2 === 0).map((look) => (
                            <View key={look.id} className="mb-4 bg-white/5 rounded-xl overflow-hidden relative group">
                                <Image
                                    source={look.image}
                                    style={{ width: '100%', height: look.height }}
                                    resizeMode="cover"
                                />
                                <View className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                    <Text className="text-white text-xs font-bold uppercase mb-0.5">{look.title}</Text>
                                    <Text className="text-[#D9F99D] text-[10px] uppercase font-bold tracking-widest">{look.season}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={{ width: '48%' }}>
                        {LOOKS.filter((_, i) => i % 2 !== 0).map((look) => (
                            <View key={look.id} className="mb-4 bg-white/5 rounded-xl overflow-hidden relative">
                                <Image
                                    source={look.image}
                                    style={{ width: '100%', height: look.height }}
                                    resizeMode="cover"
                                />
                                <View className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                    <Text className="text-white text-xs font-bold uppercase mb-0.5">{look.title}</Text>
                                    <Text className="text-[#D9F99D] text-[10px] uppercase font-bold tracking-widest">{look.season}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <Link href="/shop" asChild>
                    <TouchableOpacity className="mt-8 mb-12 bg-white self-center px-10 py-3 rounded-full">
                        <Text className="text-black font-bold uppercase tracking-widest text-sm">Shop All Looks</Text>
                    </TouchableOpacity>
                </Link>
            </ScrollView>
        </SafeAreaView>
    );
}
