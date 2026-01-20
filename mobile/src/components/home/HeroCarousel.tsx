import { useState, useRef, useEffect } from "react";
import { View, Image, Dimensions, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    interpolate,
    Extrapolate,
    runOnJS,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");
const SLIDE_WIDTH = width;
const SLIDE_HEIGHT = height * 0.75;

const HERO_SLIDES = [
    {
        id: 1,
        image: require("../../../assets/carousel/slide-1-streetwear.png"),
        title: "FASHION\nSTREETWEAR",
        subtitle: "WEAR YOUR STORY....",
        description: "Bold designs that speak your language",
        cta: "SHOP STREETWEAR",
        link: "/collections/streetwear",
        badge: "TRENDING NOW",
        gradientColors: ["rgba(132, 204, 22, 0.2)", "transparent", "rgba(0, 0, 0, 0.8)"],
    },
    {
        id: 2,
        image: require("../../../assets/carousel/slide-2-product.png"),
        title: "OUR\nPRODUCT",
        subtitle: "Global Quality, Local Pride",
        description: "Discover our curated collection",
        cta: "EXPLORE CATALOG",
        link: "/shop",
        badge: "2M+ CUSTOMERS",
        gradientColors: ["rgba(255, 255, 255, 0.1)", "transparent", "rgba(0, 0, 0, 0.8)"],
    },
    {
        id: 3,
        image: require("../../../assets/carousel/slide-3-vision.png"),
        title: "QUIT TALKING\nSTART DOING",
        subtitle: "Join the movement",
        description: "Action-takers only",
        cta: "OUR VISION",
        link: "/about",
        badge: "EST. 2024",
        gradientColors: ["rgba(249, 115, 22, 0.2)", "rgba(239, 68, 68, 0.1)", "rgba(0, 0, 0, 0.8)"],
    },
    {
        id: 4,
        image: require("../../../assets/carousel/slide-4-history.png"),
        title: "OUR\nHISTORY",
        subtitle: "Loading...",
        description: "A journey of innovation",
        cta: "DISCOVER JOURNEY",
        link: "/about",
        badge: "SINCE 2024",
        gradientColors: ["rgba(107, 114, 128, 0.2)", "transparent", "rgba(0, 0, 0, 0.9)"],
    },
    {
        id: 5,
        image: require("../../../assets/carousel/slide-5-service.png"),
        title: "OUR BEST\nSERVICE",
        subtitle: "Experience Excellence",
        description: "Premium support 24/7",
        cta: "GET STARTED",
        link: "/shop",
        badge: "24/7 SUPPORT",
        gradientColors: ["rgba(168, 85, 247, 0.2)", "rgba(236, 72, 153, 0.1)", "rgba(0, 0, 0, 0.8)"],
    },
];

export function HeroCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollX = useSharedValue(0);
    const scrollViewRef = useRef<any>(null);
    const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

    // Auto-scroll function
    const startAutoScroll = () => {
        if (autoScrollTimer.current) {
            clearInterval(autoScrollTimer.current);
        }

        autoScrollTimer.current = setInterval(() => {
            const nextIndex = (activeIndex + 1) % HERO_SLIDES.length;
            scrollViewRef.current?.scrollTo({
                x: nextIndex * SLIDE_WIDTH,
                animated: true,
            });
            setActiveIndex(nextIndex);
        }, 5000);
    };

    useEffect(() => {
        startAutoScroll();
        return () => {
            if (autoScrollTimer.current) {
                clearInterval(autoScrollTimer.current);
            }
        };
    }, [activeIndex]);

    const onScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        scrollX.value = offsetX;
        const index = Math.round(offsetX / SLIDE_WIDTH);
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    const renderSlide = (item: typeof HERO_SLIDES[0], index: number) => {
        const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
                (index - 1) * SLIDE_WIDTH,
                index * SLIDE_WIDTH,
                (index + 1) * SLIDE_WIDTH,
            ];

            const scale = interpolate(
                scrollX.value,
                inputRange,
                [0.9, 1, 0.9],
                Extrapolate.CLAMP
            );

            const opacity = interpolate(
                scrollX.value,
                inputRange,
                [0.5, 1, 0.5],
                Extrapolate.CLAMP
            );

            return {
                transform: [{ scale }],
                opacity,
            };
        });

        return (
            <Animated.View
                key={item.id}
                style={[styles.slide, animatedStyle]}
            >
                {/* Background Image */}
                <Image
                    source={item.image}
                    style={styles.slideImage}
                    resizeMode="cover"
                />

                {/* Gradient Overlay */}
                <LinearGradient
                    colors={item.gradientColors as any}
                    style={styles.gradientOverlay}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                />

                {/* Vignette Effect */}
                <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.4)"]}
                    style={styles.vignetteOverlay}
                    start={{ x: 0.5, y: 0.5 }}
                    end={{ x: 1, y: 1 }}
                />

                {/* Badge */}
                <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.contentContainer}>
                    {/* Title */}
                    <Animated.Text
                        style={styles.title}
                        entering={withSpring as any}
                    >
                        {item.title}
                    </Animated.Text>

                    {/* Subtitle */}
                    <Text style={styles.subtitle}>{item.subtitle}</Text>

                    {/* Description */}
                    <Text style={styles.description}>{item.description}</Text>

                    {/* CTA Button */}
                    <Link href={item.link as any} asChild>
                        <TouchableOpacity
                            style={styles.ctaButton}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={["#ffffff", "#f0f0f0"]}
                                style={styles.ctaGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.ctaText}>{item.cta}</Text>
                                <Text style={styles.ctaArrow}>→</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Link>
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Carousel */}
            <Animated.ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                bounces={false}
                decelerationRate="fast"
            >
                {HERO_SLIDES.map((item, index) => renderSlide(item, index))}
            </Animated.ScrollView>

            {/* Slide Counter */}
            <View style={styles.counterContainer}>
                <Text style={styles.counterCurrent}>
                    {String(activeIndex + 1).padStart(2, "0")}
                </Text>
                <Text style={styles.counterDivider}>/</Text>
                <Text style={styles.counterTotal}>
                    {String(HERO_SLIDES.length).padStart(2, "0")}
                </Text>
            </View>

            {/* Progress Indicators */}
            <View style={styles.indicatorContainer}>
                {HERO_SLIDES.map((_, index) => {
                    const animatedIndicatorStyle = useAnimatedStyle(() => {
                        const inputRange = [
                            (index - 1) * SLIDE_WIDTH,
                            index * SLIDE_WIDTH,
                            (index + 1) * SLIDE_WIDTH,
                        ];

                        const width = interpolate(
                            scrollX.value,
                            inputRange,
                            [8, 40, 8],
                            Extrapolate.CLAMP
                        );

                        const opacity = interpolate(
                            scrollX.value,
                            inputRange,
                            [0.3, 1, 0.3],
                            Extrapolate.CLAMP
                        );

                        return {
                            width,
                            opacity,
                        };
                    });

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                scrollViewRef.current?.scrollTo({
                                    x: index * SLIDE_WIDTH,
                                    animated: true,
                                });
                                setActiveIndex(index);
                            }}
                        >
                            <Animated.View
                                style={[
                                    styles.indicator,
                                    animatedIndicatorStyle,
                                ]}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        backgroundColor: "#000",
    },
    slide: {
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        position: "relative",
    },
    slideImage: {
        width: "100%",
        height: "100%",
        position: "absolute",
    },
    gradientOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    vignetteOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    badgeContainer: {
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 10,
    },
    badge: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backdropFilter: "blur(10px)",
    },
    badgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 2,
    },
    contentContainer: {
        position: "absolute",
        bottom: 100,
        left: 24,
        right: 24,
        zIndex: 10,
    },
    title: {
        fontSize: 48,
        fontWeight: "900",
        color: "#fff",
        marginBottom: 12,
        lineHeight: 52,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "300",
        color: "rgba(255, 255, 255, 0.9)",
        marginBottom: 8,
        letterSpacing: 1,
    },
    description: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.7)",
        marginBottom: 24,
        maxWidth: 300,
    },
    ctaButton: {
        alignSelf: "flex-start",
        borderRadius: 30,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    ctaGradient: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 32,
        paddingVertical: 16,
        gap: 12,
    },
    ctaText: {
        color: "#000",
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 2,
    },
    ctaArrow: {
        color: "#000",
        fontSize: 18,
        fontWeight: "700",
    },
    counterContainer: {
        position: "absolute",
        top: 40,
        left: 24,
        flexDirection: "row",
        alignItems: "baseline",
        zIndex: 10,
    },
    counterCurrent: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "700",
        fontFamily: "monospace",
    },
    counterDivider: {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 16,
        marginHorizontal: 8,
        fontFamily: "monospace",
    },
    counterTotal: {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 16,
        fontFamily: "monospace",
    },
    indicatorContainer: {
        position: "absolute",
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        zIndex: 10,
    },
    indicator: {
        height: 6,
        backgroundColor: "#fff",
        borderRadius: 3,
    },
});
