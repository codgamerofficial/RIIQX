
import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");

export function DesignNewArrivalsBanner() {
    return (
        <View className="mb-8 px-4">
            <Link href="/collections/new-arrivals" asChild>
                <TouchableOpacity activeOpacity={0.9}>
                    <View className="w-full relative bg-black overflow-hidden rounded-3xl" style={{ height: width * 0.75 }}>
                        {/* 4:3 Aspect Ratio for impact */}
                        <Image
                            source={require("../../../assets/marketing/design-03.png")}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                </TouchableOpacity>
            </Link>
        </View>
    );
}
