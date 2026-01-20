
import { View, Image, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export function DesignStreetwearHero() {
    return (
        <View className="w-full relative mb-8" style={{ height: height * 0.5 }}>
            <Image
                source={require("../../../assets/marketing/design-02.png")}
                className="w-full h-full"
                resizeMode="cover"
            />
            {/* Gradient Overlay */}
            <View className="absolute inset-0 bg-black/40" />
        </View>
    );
}
