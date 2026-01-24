import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getProducts, formatPrice } from "@/lib/shopify";
import { Product } from "@/lib/shopify/types";
import { Link } from "expo-router";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react-native";
import SortModal, { SortOption } from "@/components/SortModal";
import FilterModal, { FilterOptions } from "@/components/FilterModal";

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
        <SafeAreaView className="flex-1 bg-background">
            <View className="px-4 py-4 border-b border-white/10">
                <Text className="text-2xl font-black text-white uppercase tracking-tighter mb-4">All Drops</Text>

                {/* Search Bar */}
                <View className="bg-white/5 border border-white/10 rounded-full flex-row items-center px-4 py-3 mb-4">
                    <Search size={20} color="#666" />
                    <TextInput
                        placeholder="Search products..."
                        placeholderTextColor="#666"
                        className="flex-1 ml-3 text-white font-medium"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
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
