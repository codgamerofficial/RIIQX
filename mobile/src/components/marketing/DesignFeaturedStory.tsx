
import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");

export function DesignFeaturedStory() {
    return (
        <View className="mb-8">
            <Link href="/collections/featured" asChild>
                <TouchableOpacity activeOpacity={0.9}>
                    <View className="w-full relative bg-black overflow-hidden rounded-3xl" style={{ height: width * 0.6 }}>
                        {/* Aspect ratio approx 16:9 or custom for mobile */}
                        <Image
                            source={require("../../../assets/marketing/design-01.png")}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                </TouchableOpacity>
            </Link>
        </View>
    );
}
