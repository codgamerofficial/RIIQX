import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useRef, useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';

// Animated drawer item
function AnimatedDrawerItem({ label, onPress, icon, focused }: any) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.sequence([
            Animated.timing(scale, { toValue: 0.95, duration: 50, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
        onPress();
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={[
                styles.drawerItem,
                focused && styles.drawerItemActive
            ]}
            activeOpacity={0.7}
        >
            <Animated.View style={[styles.drawerItemContent, { transform: [{ scale }] }]}>
                <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                    {icon}
                </View>
                <Text style={[
                    styles.drawerItemLabel,
                    focused && styles.drawerItemLabelActive
                ]}>
                    {label}
                </Text>
                {focused && <View style={styles.activeIndicator} />}
            </Animated.View>
        </TouchableOpacity>
    );
}

function CustomDrawerContent(props: any) {
    const { state, navigation } = props;
    const [userEmail, setUserEmail] = useState('user@riiqx.com');

    const handleLogout = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        // Handle logout logic
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.headerContainer}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <View style={styles.logo}>
                            <Text style={styles.logoText}>R</Text>
                        </View>
                        <View>
                            <Text style={styles.brandName}>RIIQX</Text>
                            <Text style={styles.brandTagline}>Elite Streetwear</Text>
                        </View>
                    </View>
                </View>

                {/* User Info Card */}
                <View style={styles.userCard}>
                    <View style={styles.userAvatar}>
                        <Text style={styles.userAvatarText}>
                            {userEmail.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userLabel}>Welcome back</Text>
                        <Text style={styles.userEmail} numberOfLines={1}>
                            {userEmail}
                        </Text>
                    </View>
                </View>
            </SafeAreaView>

            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.drawerItems}>
                    {state.routes.map((route: any, index: number) => {
                        const focused = state.index === index;
                        const { drawerLabel, drawerIcon } = props.descriptors[route.key].options;

                        return (
                            <AnimatedDrawerItem
                                key={route.key}
                                label={drawerLabel}
                                icon={drawerIcon?.({ color: focused ? '#E31C79' : '#888', size: 22 })}
                                focused={focused}
                                onPress={() => navigation.navigate(route.name)}
                            />
                        );
                    })}
                </View>
            </DrawerContentScrollView>

            {/* Footer Actions */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.footerItem}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        // Navigate to settings
                    }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="settings-outline" size={22} color="#888" />
                    <Text style={styles.footerItemText}>Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.footerItem, styles.logoutItem]}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <Ionicons name="log-out-outline" size={22} color="#ff4444" />
                    <Text style={[styles.footerItemText, styles.logoutText]}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
        </View>
    );
}

export default function DrawerLayout() {
    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: styles.drawer,
                drawerActiveTintColor: '#E31C79',
                drawerInactiveTintColor: '#888',
                drawerLabelStyle: styles.drawerLabel,
                drawerActiveBackgroundColor: 'transparent',
                drawerItemStyle: { display: 'none' }, // Hide default items
                swipeEnabled: true,
                swipeEdgeWidth: 100,
            }}
        >
            <Drawer.Screen
                name="(tabs)"
                options={{
                    drawerLabel: 'Home',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="wishlist"
                options={{
                    drawerLabel: 'Wishlist',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="heart-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="orders"
                options={{
                    drawerLabel: 'My Orders',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="bag-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="lookbook"
                options={{
                    drawerLabel: 'Lookbook',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="images-outline" size={size} color={color} />
                    ),
                }}
            />
        </Drawer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    drawer: {
        backgroundColor: '#000000',
        width: '80%',
    },
    headerContainer: {
        backgroundColor: '#000000',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logo: {
        width: 44,
        height: 44,
        backgroundColor: '#E31C79',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold',
    },
    brandName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },
    brandTagline: {
        color: '#666',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 2,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 16,
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    userAvatar: {
        width: 44,
        height: 44,
        backgroundColor: '#E31C79',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userAvatarText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    userInfo: {
        marginLeft: 12,
        flex: 1,
    },
    userLabel: {
        color: '#E31C79',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '600',
    },
    userEmail: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        marginTop: 2,
    },
    scrollContent: {
        paddingTop: 8,
    },
    drawerItems: {
        paddingHorizontal: 12,
    },
    drawerItem: {
        marginVertical: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
    drawerItemActive: {
        backgroundColor: 'rgba(227, 28, 121, 0.1)',
    },
    drawerItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    iconContainerActive: {
        backgroundColor: 'rgba(227, 28, 121, 0.2)',
    },
    drawerItemLabel: {
        color: '#888',
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
    },
    drawerItemLabelActive: {
        color: '#E31C79',
    },
    activeIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E31C79',
    },
    drawerLabel: {
        marginLeft: -20,
        fontWeight: 'bold',
        fontSize: 14,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
    },
    footerItemText: {
        color: '#888',
        fontSize: 15,
        fontWeight: '500',
    },
    logoutItem: {
        marginTop: 4,
    },
    logoutText: {
        color: '#ff4444',
    },
    versionText: {
        color: '#444',
        fontSize: 11,
        marginTop: 16,
        textAlign: 'center',
    },
});
