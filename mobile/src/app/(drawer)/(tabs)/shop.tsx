import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getProducts, formatPrice } from "@/lib/shopify";
import { Product } from "@/lib/shopify/types";
import { Link } from "expo-router";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react-native";
import SortModal, { SortOption } from "@/components/SortModal";
import FilterModal, { FilterOptions } from "@/components/FilterModal";

import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumButton } from "@/components/ui/PremiumButton";

export default function ShopScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [currentSort, setCurrentSort] = useState("relevance");
    const [sortKey, setSortKey] = useState<'TITLE' | 'PRICE' | 'CREATED_AT' | 'BEST_SELLING'>('BEST_SELLING');
    const [reverse, setReverse] = useState(false);

    // Filter State
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({ available: false });

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                let queryString = searchQuery;
                if (filters.available) queryString += ' available:true';
                if (filters.minPrice) queryString += ` price:>=${filters.minPrice}`;
                if (filters.maxPrice) queryString += ` price:<=${filters.maxPrice}`;

                const { products: fetchedProducts } = await getProducts({
                    limit: 20,
                    query: queryString.trim(),
                    sortKey,
                    reverse
                });
                setProducts(fetchedProducts);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [searchQuery, sortKey, reverse, filters]);

    const handleSortSelect = (option: SortOption) => {
        setCurrentSort(option.value);
        setSortKey(option.sortKey as any);
        setReverse(option.reverse || false);
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <Link href={`/product/${item.handle}`} asChild>
            <TouchableOpacity className="flex-1 m-2 mb-6 group">
                <PremiumCard className="p-0 bg-surface border-white/5" variant="glass">
                    <View className="aspect-[4/5] rounded-t-[24px] overflow-hidden relative">
                        <Image
                            source={{ uri: item.featuredImage?.url }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                        {/* Sold Out / New Badge could go here */}
                    </View>
                    <View className="p-3">
                        <Text className="text-white font-display text-sm uppercase truncate mb-1">{item.title}</Text>
                        <Text className="text-brand font-mono text-xs font-bold">
                            {formatPrice(item.priceRange.minVariantPrice.amount, item.priceRange.minVariantPrice.currencyCode)}
                        </Text>
                    </View>
                </PremiumCard>
            </TouchableOpacity>
        </Link>
    );

    return (
        <View className="flex-1 bg-background">
            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="px-4 py-4 border-b border-white/5 bg-background/90 z-10">
                    <Text className="text-3xl font-display text-white uppercase tracking-tighter mb-4">All Drops</Text>

                    {/* Search Bar */}
                    <View className="bg-surface border border-white/10 rounded-full flex-row items-center px-4 py-3 mb-4">
                        <Search size={20} color="#666" />
                        <TextInput
                            placeholder="Find your vibe..."
                            placeholderTextColor="#666"
                            className="flex-1 ml-3 text-white font-sans font-medium"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Filter/Sort Buttons */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={() => setSortModalVisible(true)}
                            className="flex-1 bg-surface border border-white/10 rounded-full py-3 flex-row items-center justify-center gap-2 active:bg-white/5"
                        >
                            <ArrowUpDown size={16} color="white" />
                            <Text className="text-white font-display uppercase text-xs tracking-widest">Sort</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setFilterModalVisible(true)}
                            className="flex-1 bg-surface border border-white/10 rounded-full py-3 flex-row items-center justify-center gap-2 active:bg-white/5"
                        >
                            <SlidersHorizontal size={16} color="white" />
                            <Text className="text-white font-display uppercase text-xs tracking-widest">Filter</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#CCFF00" />
                    </View>
                ) : (
                    <FlatList
                        data={products}
                        renderItem={renderProduct}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 8, paddingBottom: 100 }}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        initialNumToRender={6}
                        maxToRenderPerBatch={6}
                        windowSize={5}
                    />
                )}

                <SortModal
                    visible={sortModalVisible}
                    onClose={() => setSortModalVisible(false)}
                    onSelect={handleSortSelect}
                    currentSort={currentSort}
                />

                <FilterModal
                    visible={filterModalVisible}
                    onClose={() => setFilterModalVisible(false)}
                    onApply={setFilters}
                    currentFilters={filters}
                />
            </SafeAreaView>
        </View>
    );
}
