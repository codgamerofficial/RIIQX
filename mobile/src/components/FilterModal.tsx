import { View, Text, Modal, TouchableOpacity, ScrollView, Switch, TextInput } from 'react-native';
import { X } from 'lucide-react-native';
import { useState } from 'react';

export type FilterOptions = {
    available: boolean;
    minPrice?: string;
    maxPrice?: string;
};

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: FilterOptions) => void;
    currentFilters: FilterOptions;
}

export default function FilterModal({ visible, onClose, onApply, currentFilters }: FilterModalProps) {
    const [available, setAvailable] = useState(currentFilters.available);
    const [minPrice, setMinPrice] = useState(currentFilters.minPrice || '');
    const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || '');

    const handleApply = () => {
        onApply({ available, minPrice, maxPrice });
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-[#1A1A1A] rounded-t-3xl overflow-hidden border-t border-white/10 h-[60%]">
                    <View className="flex-row items-center justify-between p-6 border-b border-white/5">
                        <Text className="text-white text-lg font-black uppercase tracking-widest">Filter</Text>
                        <TouchableOpacity onPress={onClose} className="p-2">
                            <X size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 p-6">
                        {/* Availability */}
                        <View className="flex-row items-center justify-between mb-8">
                            <Text className="text-white font-bold uppercase tracking-wider">In Stock Only</Text>
                            <Switch
                                trackColor={{ false: '#333', true: '#D9F99D' }}
                                thumbColor={available ? '#000' : '#f4f3f4'}
                                onValueChange={setAvailable}
                                value={available}
                            />
                        </View>

                        {/* Price Range */}
                        <Text className="text-white font-bold uppercase tracking-wider mb-4">Price Range (INR)</Text>
                        <View className="flex-row gap-4 mb-8">
                            <View className="flex-1">
                                <Text className="text-white/50 text-[10px] font-bold uppercase mb-2">Min</Text>
                                <TextInput
                                    className="bg-zinc-900 border border-white/10 text-white p-4 rounded-xl font-medium"
                                    placeholder="0"
                                    placeholderTextColor="#666"
                                    keyboardType="numeric"
                                    value={minPrice}
                                    onChangeText={setMinPrice}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white/50 text-[10px] font-bold uppercase mb-2">Max</Text>
                                <TextInput
                                    className="bg-zinc-900 border border-white/10 text-white p-4 rounded-xl font-medium"
                                    placeholder="10000+"
                                    placeholderTextColor="#666"
                                    keyboardType="numeric"
                                    value={maxPrice}
                                    onChangeText={setMaxPrice}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    <View className="p-6 border-t border-white/5">
                        <TouchableOpacity
                            onPress={handleApply}
                            className="w-full bg-[#D9F99D] py-4 rounded-full items-center"
                        >
                            <Text className="text-black font-black uppercase tracking-wider">Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
