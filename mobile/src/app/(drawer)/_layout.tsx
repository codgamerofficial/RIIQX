import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { DynamicIsland } from '../../components/ui/DynamicIsland';

function CustomDrawerContent(props: any) {
    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <SafeAreaView edges={['top']} style={{ backgroundColor: '#000000' }}>
                <View className="px-6 py-6 border-b border-white/10">
                    <Text className="text-white text-3xl font-bold tracking-tighter">RIIQX</Text>
                    <Text className="text-gray-500 text-xs uppercase tracking-widest mt-1">Elite Streetwear</Text>
                </View>
            </SafeAreaView>

            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>

            <View className="p-6 border-t border-white/10">
                <TouchableOpacity className="flex-row items-center space-x-3 mb-4">
                    <Ionicons name="settings-outline" size={22} color="gray" />
                    <Text className="text-gray-400 font-medium ml-3">Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center space-x-3">
                    <Ionicons name="log-out-outline" size={22} color="gray" />
                    <Text className="text-gray-400 font-medium ml-3">Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function DrawerLayout() {
    return (
    return (
        <>
            <DynamicIsland />
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerShown: false,
                    drawerStyle: {
                        backgroundColor: '#000000',
                        width: '80%',
                    },
                    drawerActiveTintColor: '#E31C79',
                    drawerInactiveTintColor: '#FFFFFF',
                    drawerLabelStyle: {
                        marginLeft: -20,
                        fontWeight: 'bold',
                        fontSize: 14,
                    },
                    drawerActiveBackgroundColor: 'rgba(227, 28, 121, 0.1)',
                }}
            >
                <Drawer.Screen
                    name="(tabs)"
                    options={{
                        drawerLabel: 'Home',
                        drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
                    }}
                />
            </Drawer>
        </>
    );
}
