import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, Animated, Easing, StatusBar } from 'react-native';
import ReAnimated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SharedValue, useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, interpolate, Extrapolation } from 'react-native-reanimated';

// Carousel Assets
const CAROUSEL_IMAGES = [
    require('../../../../assets/carousel/slide-1-streetwear.png'),
    require('../../../../assets/carousel/slide-2-product.png'),
    require('../../../../assets/carousel/slide-3-vision.png'),
    require('../../../../assets/carousel/slide-4-history.png'),
    require('../../../../assets/carousel/slide-5-service.png'),
];

const { width } = Dimensions.get('window');
const HEIGHT = 320;

const CAROUSEL_DATA = [
    {
        id: 1,
        title: 'STREETWEAR',
        subtitle: 'DROP 01 // 2026',
        description: 'Urban apocalypse ready. Technical fabrics meet street culture.',
        cta: 'SHOP NOW',
        color: '#E31C79',
        neonColor: '#FF69B4',
        imageIndex: 0,
    },
    {
        id: 2,
        title: 'NEW ARRIVALS',
        subtitle: 'LIMITED EDITION',
        description: 'Fresh drops you can\'t miss. Be first in line.',
        cta: 'EXPLORE',
        color: '#CCFF00',
        neonColor: '#DDFF44',
        imageIndex: 1,
    },
    {
        id: 3,
        title: 'OUR VISION',
        subtitle: 'THE FUTURE',
        description: 'Redefining fashion for the next generation.',
        cta: 'LEARN MORE',
        color: '#00F0FF',
        neonColor: '#44FFFF',
        imageIndex: 2,
    },
    {
        id: 4,
        title: 'OUR STORY',
        subtitle: 'SINCE 2024',
        description: 'Built by Gen Z, for Gen Z. This is our journey.',
        cta: 'DISCOVER',
        color: '#FF00FF',
        neonColor: '#FF44FF',
        imageIndex: 3,
    },
    {
        id: 5,
        title: 'PREMIUM SERVICE',
        subtitle: 'VIP ACCESS',
        description: 'Exclusive perks for our elite members.',
        cta: 'JOIN NOW',
        color: '#FFD700',
        neonColor: '#FFEC44',
        imageIndex: 4,
    },
];

export function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useSharedValue(0);
    const progress = useSharedValue(0);

    // Neon glow animation
    const glowAnim = useSharedValue(1);

    useEffect(() => {
        glowAnim.value = withRepeat(
            withSequence(
                withTiming(1.5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    // Auto-scroll timer
    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % CAROUSEL_DATA.length;
            setCurrentIndex(nextIndex);
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        scrollX.value = offsetX;
        const newIndex = Math.round(offsetX / width);
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Main Carousel */}
            <Animated.ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                snapToInterval={width}
                snapToAlignment="start"
                decelerationRate="fast"
            >
                {CAROUSEL_DATA.map((item, index) => (
                    <CarouselSlide
                        key={item.id}
                        item={item}
                        index={index}
                        scrollX={scrollX}
                        glowAnim={glowAnim}
                    />
                ))}
            </Animated.ScrollView>

            {/* Progress Bar */}
            <ProgressBar
                currentIndex={currentIndex}
                total={CAROUSEL_DATA.length}
                duration={5000}
            />

            {/* Pagination Dots */}
            <PaginationDots
                currentIndex={currentIndex}
                total={CAROUSEL_DATA.length}
                scrollX={scrollX}
                items={CAROUSEL_DATA}
            />

            {/* Navigation Arrows */}
            <NavigationArrows
                currentIndex={currentIndex}
                total={CAROUSEL_DATA.length}
                onPress={goToSlide}
            />
        </View>
    );
}

// Individual Slide Component
function CarouselSlide({ item, index, scrollX, glowAnim }: {
    item: typeof CAROUSEL_DATA[0];
    index: number;
    scrollX: SharedValue<number>;
    glowAnim: SharedValue<number>;
}) {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const imageAnimatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(scrollX.value, inputRange, [1.1, 1, 1.1], Extrapolation.CLAMP);
        const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], Extrapolation.CLAMP);

        return {
            transform: [{ scale }],
            opacity,
        };
    });

    const titleAnimatedStyle = useAnimatedStyle(() => {
        const translateY = interpolate(scrollX.value, inputRange, [30, 0, 30], Extrapolation.CLAMP);
        const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP);

        return {
            transform: [{ translateY }],
            opacity,
        };
    });

    const subtitleAnimatedStyle = useAnimatedStyle(() => {
        const translateX = interpolate(scrollX.value, inputRange, [50, 0, 50], Extrapolation.CLAMP);
        const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP);

        return {
            transform: [{ translateX }],
            opacity,
        };
    });

    const glowAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: glowAnim.value,
        };
    });

    return (
        <View style={[styles.slide, { width }]}>
            {/* Background Image */}
            <Animated.Image
                source={CAROUSEL_IMAGES[item.imageIndex]}
                style={[styles.image, imageAnimatedStyle]}
                resizeMode="cover"
            />

            {/* Dark Overlay */}
            <LinearGradient
                colors={[
                    'rgba(0,0,0,0.2)',
                    'rgba(0,0,0,0.3)',
                    'rgba(0,0,0,0.6)',
                    'rgba(0,0,0,0.9)',
                ]}
                style={styles.overlay}
            />

            {/* Neon Glow Effect */}
            <ReAnimated.View
                style={[
                    styles.neonGlow,
                    { backgroundColor: item.neonColor },
                    glowAnimatedStyle,
                ]}
            />

            {/* Content */}
            <View style={styles.content}>
                {/* Subtitle with Glow */}
                <Animated.View style={[styles.subtitleContainer, subtitleAnimatedStyle]}>
                    <View style={[styles.glowBadge, { borderColor: item.color }]}>
                        <Text style={[styles.subtitle, { color: item.color }]}>
                            {item.subtitle}
                        </Text>
                    </View>
                </Animated.View>

                {/* Main Title */}
                <Animated.View style={titleAnimatedStyle}>
                    <Text style={[styles.title, { textShadowColor: item.neonColor, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 }]}>
                        {item.title.split(' ').map((word, i) => (
                            <Text key={i}>{word}{'\n'}</Text>
                        ))}
                    </Text>
                </Animated.View>

                {/* Description */}
                <Animated.View style={[styles.descriptionContainer, subtitleAnimatedStyle]}>
                    <Text style={styles.description}>{item.description}</Text>
                </Animated.View>

                {/* CTA Button */}
                <Animated.View style={[styles.ctaContainer, subtitleAnimatedStyle]}>
                    <TouchableOpacity
                        style={[styles.ctaButton, { backgroundColor: item.color }]}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.ctaText}>{item.cta}</Text>
                        <View style={[styles.ctaArrow, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {/* Slide Number */}
            <View style={styles.slideNumber}>
                <Text style={styles.slideNumberText}>
                    {String(index + 1).padStart(2, '0')}
                </Text>
                <View style={[styles.slideNumberLine, { backgroundColor: item.color }]} />
            </View>
        </View>
    );
}

// Progress Bar Component
function ProgressBar({ currentIndex, total, duration }: {
    currentIndex: number;
    total: number;
    duration: number;
}) {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = 0;
        progress.value = withTiming(1, { duration }, () => {
            // Reset when complete
        });
    }, [currentIndex]);

    const progressStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value * 100}%`,
        };
    });

    return (
        <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
                {Array.from({ length: total }).map((_, index) => (
                    <View key={index} style={styles.progressSegment}>
                        {index === currentIndex && (
                            <Animated.View
                                style={[
                                    styles.progressBar,
                                    progressStyle,
                                    { backgroundColor: CAROUSEL_DATA[index].color }
                                ]}
                            />
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}

// Pagination Dots Component
function PaginationDots({ currentIndex, total, scrollX, items }: {
    currentIndex: number;
    total: number;
    scrollX: SharedValue<number>;
    items: typeof CAROUSEL_DATA;
}) {
    return (
        <View style={styles.paginationContainer}>
            {Array.from({ length: total }).map((_, index) => {
                const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

                const dotAnimatedStyle = useAnimatedStyle(() => {
                    const scale = interpolate(scrollX.value, inputRange, [0.6, 1.2, 0.6], Extrapolation.CLAMP);
                    const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], Extrapolation.CLAMP);

                    return {
                        transform: [{ scale }],
                        opacity,
                    };
                });

                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            // Handle dot press
                            const newIndex = index;
                            const scrollView = require('react-native').findNodeHandle(
                                require('react-native').findHostInstanceWithChild?.()
                            );
                        }}
                        style={styles.dotTouchable}
                    >
                        <Animated.View
                            style={[
                                styles.dot,
                                { backgroundColor: items[index].color },
                                dotAnimatedStyle,
                                currentIndex === index && styles.activeDot,
                            ]}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// Navigation Arrows Component
function NavigationArrows({ currentIndex, total, onPress }: {
    currentIndex: number;
    total: number;
    onPress: (index: number) => void;
}) {
    return (
        <View style={styles.arrowsContainer}>
            <TouchableOpacity
                style={[styles.arrow, styles.arrowLeft]}
                onPress={() => onPress((currentIndex - 1 + total) % total)}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
                <View style={[styles.arrowCircle, { borderColor: CAROUSEL_DATA[currentIndex].color }]}>
                    <Text style={[styles.arrowText, { color: CAROUSEL_DATA[currentIndex].color }]}>‹</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.arrow, styles.arrowRight]}
                onPress={() => onPress((currentIndex + 1) % total)}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
                <View style={[styles.arrowCircle, { borderColor: CAROUSEL_DATA[currentIndex].color }]}>
                    <Text style={[styles.arrowText, { color: CAROUSEL_DATA[currentIndex].color }]}>›</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: HEIGHT,
        backgroundColor: '#0A0A0A',
    },
    slide: {
        height: HEIGHT,
        position: 'relative',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    neonGlow: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.3,
    },
    content: {
        position: 'absolute',
        bottom: 60,
        left: 24,
        right: 24,
        justifyContent: 'flex-end',
    },
    subtitleContainer: {
        marginBottom: 8,
    },
    glowBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    subtitle: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 3,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        lineHeight: 44,
        color: '#FFFFFF',
        letterSpacing: -2,
        marginBottom: 8,
    },
    descriptionContainer: {
        marginBottom: 16,
    },
    description: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 20,
        maxWidth: '80%',
    },
    ctaContainer: {
        marginBottom: 8,
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    ctaText: {
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 2,
        color: '#000000',
        textTransform: 'uppercase',
    },
    ctaArrow: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginLeft: 10,
    },
    slideNumber: {
        position: 'absolute',
        top: 20,
        right: 24,
        alignItems: 'center',
    },
    slideNumberText: {
        fontSize: 48,
        fontWeight: '900',
        color: '#FFFFFF',
        opacity: 0.2,
        lineHeight: 48,
    },
    slideNumberLine: {
        width: 30,
        height: 3,
        borderRadius: 2,
        marginTop: 4,
    },
    progressContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    progressTrack: {
        flexDirection: 'row',
        height: '100%',
    },
    progressSegment: {
        flex: 1,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: 2,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 20,
        left: 24,
        flexDirection: 'row',
        gap: 10,
    },
    dotTouchable: {
        padding: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        opacity: 0.4,
    },
    activeDot: {
        opacity: 1,
        transform: [{ scale: 1.3 }],
    },
    arrowsContainer: {
        position: 'absolute',
        bottom: 60,
        right: 24,
        flexDirection: 'row',
        gap: 12,
    },
    arrow: {
        position: 'absolute',
        bottom: 0,
    },
    arrowLeft: {
        right: 60,
    },
    arrowRight: {
        right: 0,
    },
    arrowCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    arrowText: {
        fontSize: 24,
        fontWeight: '300',
        marginTop: -2,
    },
});
