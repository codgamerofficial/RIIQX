import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { DesignStreetwearHero } from "@/components/marketing/DesignStreetwearHero";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getCollectionProducts } from "@/lib/shopify";
import { Product } from "@/lib/shopify/types";
import { useLocalSearchParams, Link, Stack } from "expo-router";
import { ArrowLeft, SlidersHorizontal, ArrowUpDown } from "lucide-react-native";
import SortModal, { SortOption } from "@/components/SortModal";
import FilterModal, { FilterOptions } from "@/components/FilterModal";

export default function CollectionScreen() {
    const { handle } = useLocalSearchParams<{ handle: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Sort & Filter State
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [currentSort, setCurrentSort] = useState("relevance");
    const [sortKey, setSortKey] = useState<'TITLE' | 'PRICE' | 'CREATED' | 'BEST_SELLING'>('BEST_SELLING'); // Note: Collection uses CREATED, Shop uses CREATED_AT usually, but check types.
    const [reverse, setReverse] = useState(false);

    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({ available: false });

    // Format Title
    const title = handle ? handle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Collection';

    useEffect(() => {
        async function loadData() {
            if (!handle) return;
            setLoading(true);
            try {
                // Construct Shopify filter object logic equivalent to ShopScreen
                // getCollectionProducts in mobile/src/lib/shopify/index.ts accepts `filters` param.
                // We should pass an array of objects.
                const productFilters: any[] = [];
                if (filters.available) {
                    productFilters.push({ available: true });
                }
                if (filters.minPrice || filters.maxPrice) {
                    productFilters.push({
                        price: {
                            min: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
                            max: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
                        }
                    });
                }

                const { products: fetchedProducts } = await getCollectionProducts({
                    handle,
                    limit: 50,
                    sortKey,
                    reverse,
                    filters: productFilters
                });
                setProducts(fetchedProducts);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [handle, sortKey, reverse, filters]);

    const handleSortSelect = (option: SortOption) => {
        setCurrentSort(option.value);
        setSortKey(option.sortKey as any);
        setReverse(option.reverse || false);
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <Link href={`/product/${item.handle}`} asChild>
            <TouchableOpacity className="flex-1 m-2 mb-6 group">
                <View className="aspect-[4/5] bg-muted rounded-xl overflow-hidden border border-white/5 mb-2 relative">
                    <Image
                        source={{ uri: item.featuredImage?.url }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>
                <Text className="text-white font-bold text-xs uppercase truncate">{item.title}</Text>
                <Text className="text-[#D9F99D] text-xs font-bold mt-1">
                    {formatPrice(item.priceRange.minVariantPrice.amount, item.priceRange.minVariantPrice.currencyCode)}
                </Text>
            </TouchableOpacity>
        </Link>
    );

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-4 py-4 border-b border-white/10">
                <View className="flex-row items-center gap-4 mb-4">
                    <Link href="../" asChild>
                        <TouchableOpacity>
                            <ArrowLeft color="white" size={24} />
                        </TouchableOpacity>
                    </Link>
                    <View>
                        <Text className="text-xl font-black text-white uppercase tracking-tighter">{title}</Text>
                        <Text className="text-white/50 text-xs font-medium uppercase tracking-widest">{products.length} Items</Text>
                    </View>
                </View>

                {/* Filter/Sort Buttons */}
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => setSortModalVisible(true)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 flex-row items-center justify-center gap-2"
                    >
                        <ArrowUpDown size={16} color="white" />
                        <Text className="text-white font-bold uppercase text-[10px] tracking-widest">Sort</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setFilterModalVisible(true)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 flex-row items-center justify-center gap-2"
                    >
                        <SlidersHorizontal size={16} color="white" />
                        <Text className="text-white font-bold uppercase text-[10px] tracking-widest">Filter</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#D9F99D" />
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={{ padding: 8, paddingBottom: 100 }}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    ListHeaderComponent={
                        handle === 'streetwear' ? (
                            <View className="mb-6">
                                <DesignStreetwearHero />
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        <View className="py-20 items-center">
                            <Text className="text-white/50">No items found.</Text>
                        </View>
                    }
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
    );
}
