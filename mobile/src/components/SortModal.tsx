import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

export type SortOption = {
    label: string;
    value: string;
    sortKey: 'TITLE' | 'PRICE' | 'BEST_SELLING' | 'CREATED';
    reverse?: boolean;
};

const SORT_OPTIONS: SortOption[] = [
    { label: 'Relevance', value: 'relevance', sortKey: 'BEST_SELLING', reverse: false }, // Default-ish
    { label: 'Newest Arrivals', value: 'newest', sortKey: 'CREATED', reverse: true },
    { label: 'Price: Low to High', value: 'price_asc', sortKey: 'PRICE', reverse: false },
    { label: 'Price: High to Low', value: 'price_desc', sortKey: 'PRICE', reverse: true },
    { label: 'Best Selling', value: 'best_selling', sortKey: 'BEST_SELLING', reverse: false },
];

interface SortModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (option: SortOption) => void;
    currentSort: string;
}

export default function SortModal({ visible, onClose, onSelect, currentSort }: SortModalProps) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-[#1A1A1A] rounded-t-3xl overflow-hidden border-t border-white/10">
                    <View className="flex-row items-center justify-between p-6 border-b border-white/5">
                        <Text className="text-white text-lg font-black uppercase tracking-widest">Sort By</Text>
                        <TouchableOpacity onPress={onClose} className="p-2">
                            <X size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="pb-10">
                        {SORT_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => {
                                    onSelect(option);
                                    onClose();
                                }}
                                className="flex-row items-center justify-between p-6 border-b border-white/5 active:bg-white/5"
                            >
                                <Text className={`text-base font-bold uppercase tracking-wider ${currentSort === option.value ? 'text-[#D9F99D]' : 'text-white'}`}>
                                    {option.label}
                                </Text>
                                {currentSort === option.value && <Check size={20} color="#D9F99D" />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
