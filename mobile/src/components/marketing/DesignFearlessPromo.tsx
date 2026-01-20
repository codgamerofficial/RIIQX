
import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");

export function DesignFearlessPromo() {
    return (
        <View className="mb-8">
            <Link href="/shop" asChild>
                <TouchableOpacity activeOpacity={0.9}>
                    {/* Aspect ratio 16:9 for mobile promo */}
                    <View className="w-full relative bg-[#E5E5E5] overflow-hidden rounded-2xl" style={{ height: width * 0.56 }}>
                        <Image
                            source={require("../../../assets/marketing/design-04.png")}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                </TouchableOpacity>
            </Link>
        </View>
    );
}
