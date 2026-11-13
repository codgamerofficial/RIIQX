// =============================================================================
// RIIQX Mobile — Smart Commerce, Price Intelligence & Cross-Platform Arbitrage
// Native Mobile Tab: Camera OCR • Share Intent • 6 Retailer Comparison • Gift Cards
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../src/services/api';

const SAMPLE_HERITAGE_PRODUCTS = [
  {
    id: 'prod_brass_valet_01',
    sku: 'RIIQX-OBJ-BRS-01',
    title: 'The Royal Brass Valet Tray',
    subtitle: 'Hand-hammered solid brass catchall with warm sandalwood patina',
    collection: 'RIIQX Objects',
    category: 'Desk Accessories',
    mrp: 2999,
    price: 1899,
    materials: ['100% Solid Brass', 'Felt Underlay Protection'],
    dimensions: '22cm × 14cm × 2.5cm',
    countryOfOrigin: 'Moradabad, India',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop',
    ],
    badges: ['Best Seller', 'Artisanal Heritage'],
  },
  {
    id: 'prod_teak_desk_mat_02',
    sku: 'RIIQX-OBJ-TEA-02',
    title: 'The Teak & Vegan Leather Desk Mat',
    subtitle: 'Reclaimed teakwood rail with premium non-slip vegan leather base',
    collection: 'RIIQX Objects',
    category: 'Desk Accessories',
    mrp: 2799,
    price: 1699,
    materials: ['Reclaimed Indian Teak', 'Full-Grain Vegan Microfiber'],
    dimensions: '80cm × 40cm × 0.4cm',
    countryOfOrigin: 'Saharanpur, India',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop',
    ],
    badges: ['Conscious Craft'],
  },
  {
    id: 'prod_stoneware_mug_05',
    sku: 'RIIQX-LIV-MUG-05',
    title: 'The Jodhpur Terracotta Ceramic Mug',
    subtitle: 'Dual-glazed natural sand stoneware crafted for slow pour coffee',
    collection: 'RIIQX Living',
    category: 'Drinkware',
    mrp: 1499,
    price: 899,
    materials: ['Khurja Studio Clay', 'Food-Safe Satin Glaze'],
    dimensions: '380ml capacity',
    countryOfOrigin: 'Khurja, Uttar Pradesh',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop',
    ],
    badges: ['Best Seller'],
  },
  {
    id: 'prod_leather_folio_09',
    sku: 'RIIQX-CRY-FOL-09',
    title: 'Architectural Document & Tech Folio',
    subtitle: 'Vegetable-tanned full-grain leather sleeve for 14-inch laptops',
    collection: 'RIIQX Carry',
    category: 'Everyday Carry',
    mrp: 4499,
    price: 2899,
    materials: ['Vegetable-Tanned Saddle Leather', 'Solid Brass Rivets'],
    dimensions: '35cm × 25cm × 2cm',
    countryOfOrigin: 'Kanpur, India',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop',
    ],
    badges: ['Artisanal Heritage'],
  },
];

export default function MobileShoppingScreen() {
  const [productUrl, setProductUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [activeSegment, setActiveSegment] = useState<'heritage' | 'comparator' | 'trending' | 'tracker'>('heritage');

  // Heritage Store state
  const [heritageProducts, setHeritageProducts] = useState<any[]>(SAMPLE_HERITAGE_PRODUCTS);
  const [loadingHeritage, setLoadingHeritage] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [checkoutProduct, setCheckoutProduct] = useState<any | null>(null);
  const [checkoutAddress, setCheckoutAddress] = useState({
    name: 'Saswata Dey',
    phone: '+91 98765 43210',
    address: 'Salt Lake Sector V',
    city: 'Kolkata',
    pincode: '700091',
  });
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);

  // Tracking state
  const [trackingId, setTrackingId] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);

  // Trending products
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(false);

  useEffect(() => {
    fetchHeritage();
    fetchTrending();
  }, []);

  const fetchHeritage = async () => {
    try {
      setLoadingHeritage(true);
      const res = await api.getHeritageCommerceProducts();
      if (res && res.products && res.products.length > 0) {
        setHeritageProducts(res.products);
      }
    } catch {
      // Fallback to initial heritage collection
      setHeritageProducts(SAMPLE_HERITAGE_PRODUCTS);
    } finally {
      setLoadingHeritage(false);
    }
  };

  const handleExecutePrepaidOrder = async () => {
    if (!checkoutProduct) return;
    try {
      setIsPlacingOrder(true);
      const res = await api.initiateCommerceCheckout({
        items: [{ productId: checkoutProduct.id, quantity: 1 }],
        shippingAddress: {
          fullName: checkoutAddress.name,
          phone: checkoutAddress.phone,
          addressLine1: checkoutAddress.address,
          city: checkoutAddress.city,
          state: 'West Bengal',
          pincode: checkoutAddress.pincode,
          country: 'India',
        },
        paymentMethod: checkoutPaymentMethod,
      });

      if (res && res.order) {
        // Automatically verify prepaid payment in sandbox
        const verifyRes = await api.verifyCommerceCheckout({
          orderId: res.order.id,
          paymentId: `pay_upi_${Date.now()}`,
          gatewayName: 'razorpay',
        });

        setOrderConfirmed({
          ...res.order,
          ...verifyRes,
        });
        setCheckoutProduct(null);
      }
    } catch (e: any) {
      Alert.alert('Checkout Notice', e.message || 'Payment initiation failed.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const fetchTrending = async () => {
    try {
      setLoadingTrending(true);
      const res = await api.getMarketplaceProducts({ sortBy: 'popularity' });
      if (res && res.products) {
        setTrendingProducts(res.products);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoadingTrending(false);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      let text = '';
      if (typeof navigator !== 'undefined' && (navigator as any).clipboard?.readText) {
        text = await (navigator as any).clipboard.readText();
      }
      if (text && text.startsWith('http')) {
        setProductUrl(text);
        runAnalysis(text);
      } else {
        Alert.alert('Clipboard Notice', 'No valid URL found in clipboard.');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Unable to read from clipboard.');
    }
  };

  const runAnalysis = async (urlToAnalyze?: string) => {
    const targetUrl = urlToAnalyze || productUrl;
    if (!targetUrl.trim()) {
      Alert.alert('Input Required', 'Please enter a valid product link from Amazon, Flipkart, Myntra, etc.');
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await api.analyzeProduct({ url: targetUrl.trim() });
      if (res.success) {
        setAnalysisResult(res);
      } else {
        Alert.alert('Analysis Notice', res.error || 'Could not analyze product');
      }
    } catch (err: any) {
      Alert.alert('Connection Error', err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTrackOrder = async () => {
    if (!trackingId.trim()) {
      Alert.alert('Order ID Required', 'Please enter your order ID (e.g. ORD_RIIQX_...)');
      return;
    }

    setTrackingLoading(true);
    try {
      const res = await api.trackDropshippingOrder(trackingId.trim());
      if (res.success && res.order) {
        setTrackingResult(res.order);
      } else {
        Alert.alert('Not Found', 'Order ID not found in system.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>R</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>RIIQX Commerce</Text>
            <Text style={styles.headerSubtitle}>Cross-Platform Price Intelligence</Text>
          </View>
        </View>
      </View>

      {/* Segment Selector */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeSegment === 'heritage' && styles.segmentBtnActive]}
          onPress={() => setActiveSegment('heritage')}
        >
          <Ionicons
            name="sparkles"
            size={15}
            color={activeSegment === 'heritage' ? '#FFD43B' : '#888899'}
          />
          <Text
            style={[styles.segmentBtnText, activeSegment === 'heritage' && styles.segmentBtnTextActive]}
          >
            Heritage
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeSegment === 'comparator' && styles.segmentBtnActive]}
          onPress={() => setActiveSegment('comparator')}
        >
          <Ionicons
            name="search"
            size={15}
            color={activeSegment === 'comparator' ? '#FFD43B' : '#888899'}
          />
          <Text
            style={[styles.segmentBtnText, activeSegment === 'comparator' && styles.segmentBtnTextActive]}
          >
            Scanner
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeSegment === 'trending' && styles.segmentBtnActive]}
          onPress={() => setActiveSegment('trending')}
        >
          <Ionicons
            name="trending-up"
            size={15}
            color={activeSegment === 'trending' ? '#FFD43B' : '#888899'}
          />
          <Text
            style={[styles.segmentBtnText, activeSegment === 'trending' && styles.segmentBtnTextActive]}
          >
            Trending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeSegment === 'tracker' && styles.segmentBtnActive]}
          onPress={() => setActiveSegment('tracker')}
        >
          <Ionicons
            name="cube"
            size={15}
            color={activeSegment === 'tracker' ? '#FFD43B' : '#888899'}
          />
          <Text
            style={[styles.segmentBtnText, activeSegment === 'tracker' && styles.segmentBtnTextActive]}
          >
            Track
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* SEGMENT 0: RIIQX 2.0 MODERN INDIAN HERITAGE STOREFRONT */}
        {activeSegment === 'heritage' && (
          <View>
            {/* Heritage Banner */}
            <View style={{
              backgroundColor: '#1C1917',
              borderRadius: 16,
              padding: 18,
              borderWidth: 1,
              borderColor: '#44403C',
              marginBottom: 16,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#C5A059', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  Modern Indian Heritage
                </Text>
                <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: '#C2593F' }}>
                  <Text style={{ fontSize: 8, fontWeight: '900', color: '#FFFFFF' }}>D2C</Text>
                </View>
              </View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#FBF9F5', letterSpacing: -0.5 }}>
                A New Perspective on Indian Living
              </Text>
              <Text style={{ fontSize: 12, color: '#A8A29E', marginTop: 4, lineHeight: 18 }}>
                Curated desk objects, hand-turned Sheesham wood, and Jaipur stoneware. Zero middleman markup. 100% prepaid.
              </Text>
            </View>

            {/* Collection Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {['all', 'RIIQX Objects', 'RIIQX Living', 'RIIQX Carry'].map((col) => {
                const isSelected = selectedCollection === col;
                return (
                  <TouchableOpacity
                    key={col}
                    onPress={() => setSelectedCollection(col)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      borderRadius: 20,
                      backgroundColor: isSelected ? '#C5A059' : '#1C1917',
                      borderWidth: 1,
                      borderColor: isSelected ? '#C5A059' : '#292524',
                      marginRight: 8,
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '700', color: isSelected ? '#0C0C0E' : '#D6D3D1' }}>
                      {col === 'all' ? 'All Collections' : col}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Products List */}
            {loadingHeritage ? (
              <ActivityIndicator color="#C5A059" style={{ marginVertical: 30 }} />
            ) : (
              heritageProducts
                .filter((p) => selectedCollection === 'all' || p.collection === selectedCollection)
                .map((product) => (
                  <View
                    key={product.id}
                    style={{
                      backgroundColor: '#16161F',
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: '#292524',
                      marginBottom: 16,
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      source={{ uri: product.images?.[0] }}
                      style={{ width: '100%', height: 200, backgroundColor: '#292524' }}
                      resizeMode="cover"
                    />
                    <View style={{ padding: 16 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#C5A059', textTransform: 'uppercase', letterSpacing: 1 }}>
                          {product.collection}
                        </Text>
                        <Text style={{ fontSize: 10, fontWeight: '600', color: '#A8A29E' }}>
                          Origin: {product.countryOfOrigin || 'India'}
                        </Text>
                      </View>

                      <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 }}>
                        {product.title}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#888899', lineHeight: 16, marginBottom: 12 }}>
                        {product.subtitle}
                      </Text>

                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#262635' }}>
                        <View>
                          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                            <Text style={{ fontSize: 18, fontWeight: '900', color: '#FBF9F5' }}>
                              ₹{product.price?.toLocaleString('en-IN')}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#78716C', textDecorationLine: 'line-through' }}>
                              ₹{product.mrp?.toLocaleString('en-IN')}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 9, color: '#10B981', fontWeight: '700' }}>
                            Prepaid • Free Pan-India Delivery
                          </Text>
                        </View>

                        <TouchableOpacity
                          onPress={() => setCheckoutProduct(product)}
                          style={{
                            backgroundColor: '#C5A059',
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderRadius: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <Ionicons name="bag-check" size={14} color="#0C0C0E" />
                          <Text style={{ fontSize: 12, fontWeight: '800', color: '#0C0C0E' }}>
                            Order Now
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
            )}
          </View>
        )}
        {/* SEGMENT 1: PRICE COMPARATOR */}
        {activeSegment === 'comparator' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Compare 6 E-Commerce Platforms</Text>
              <Text style={styles.cardSubtitle}>
                Paste an Amazon, Flipkart, Myntra, Ajio, Meesho, or Tata CLiQ product link:
              </Text>

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  placeholder="https://www.flipkart.com/product/..."
                  placeholderTextColor="#666677"
                  value={productUrl}
                  onChangeText={setProductUrl}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.pasteBtn} onPress={handlePasteClipboard}>
                  <Ionicons name="clipboard-outline" size={18} color="#FFD43B" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => runAnalysis()}
                disabled={analyzing}
              >
                {analyzing ? (
                  <ActivityIndicator color="#0C0C0E" size="small" />
                ) : (
                  <>
                    <Ionicons name="flash" size={18} color="#0C0C0E" />
                    <Text style={styles.actionBtnText}>Analyze Best Price & Savings</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Analysis Results View */}
            {analysisResult && (
              <View style={styles.resultsContainer}>
                {/* Product Hero */}
                <View style={styles.productHeroCard}>
                  {analysisResult.extractedProduct?.imageUrl && (
                    <Image
                      source={{ uri: analysisResult.extractedProduct.imageUrl }}
                      style={styles.productThumb}
                    />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productTitle} numberOfLines={2}>
                      {analysisResult.extractedProduct?.title}
                    </Text>
                    <View style={styles.badgeRow}>
                      <View style={styles.specBadge}>
                        <Text style={styles.specBadgeText}>✓ Exact Spec Match</Text>
                      </View>
                      <Text style={styles.mrpText}>
                        MRP: ₹{analysisResult.extractedProduct?.originalMrp?.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Savings Banner */}
                {analysisResult.optimalPlan && (
                  <View style={styles.savingsBanner}>
                    <View>
                      <Text style={styles.savingsLabel}>Lowest Effective Price</Text>
                      <Text style={styles.savingsPrice}>
                        ₹{analysisResult.optimalPlan.finalLowestEffectivePrice?.toLocaleString('en-IN')}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.savingsHighlight}>
                        Save ₹{(analysisResult.optimalPlan.originalPrice - analysisResult.optimalPlan.finalLowestEffectivePrice)?.toLocaleString('en-IN')}
                      </Text>
                      <Text style={styles.savingsSub}>With Gift Card Arbitrage</Text>
                    </View>
                  </View>
                )}

                {/* Retailer Comparison Cards */}
                <Text style={styles.sectionHeader}>Platform Price Breakdown</Text>
                {analysisResult.platformComparisons?.map((p: any, idx: number) => (
                  <View key={idx} style={[styles.platformRow, p.isCheapest && styles.platformRowCheapest]}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.platformName}>{p.displayName}</Text>
                        {p.isCheapest && (
                          <View style={styles.cheapestBadge}>
                            <Text style={styles.cheapestBadgeText}>CHEAPEST</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.deliveryText}>
                        {p.deliveryDays ? `Delivers in ${p.deliveryDays} days` : 'Standard Delivery'} • {p.sellerName || 'Verified Seller'}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.platformPrice}>
                        ₹{p.finalEffectivePrice?.toLocaleString('en-IN')}
                      </Text>
                      {p.discountPct > 0 && (
                        <Text style={styles.discountText}>{p.discountPct}% OFF</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* SEGMENT 2: TRENDING DROPSHIPPING PRODUCTS */}
        {activeSegment === 'trending' && (
          <View>
            <Text style={styles.sectionHeader}>Curated High-Margin Marketplace</Text>
            {loadingTrending ? (
              <ActivityIndicator color="#FFD43B" style={{ marginVertical: 30 }} />
            ) : (
              trendingProducts.map((item, idx) => (
                <View key={idx} style={styles.trendingCard}>
                  <Image source={{ uri: item.images?.[0] }} style={styles.trendingImage} />
                  <View style={styles.trendingInfo}>
                    <Text style={styles.trendingTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.trendingCategory}>{item.category} • {item.brand}</Text>
                    <View style={styles.trendingPriceRow}>
                      <Text style={styles.trendingPrice}>
                        ₹{item.currentPrice?.toLocaleString('en-IN')}
                      </Text>
                      <Text style={styles.trendingVerified}>✓ In Stock</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* SEGMENT 3: LIVE ORDER TRACKER */}
        {activeSegment === 'tracker' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Live Dropshipping Order Tracker</Text>
              <Text style={styles.cardSubtitle}>
                Enter your order ID to view real-time courier milestones:
              </Text>

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  placeholder="ORD_RIIQX_..."
                  placeholderTextColor="#666677"
                  value={trackingId}
                  onChangeText={setTrackingId}
                  autoCapitalize="characters"
                />
              </View>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleTrackOrder}
                disabled={trackingLoading}
              >
                {trackingLoading ? (
                  <ActivityIndicator color="#0C0C0E" size="small" />
                ) : (
                  <>
                    <Ionicons name="navigate" size={18} color="#0C0C0E" />
                    <Text style={styles.actionBtnText}>Track Courier Shipment</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {trackingResult && (
              <View style={styles.trackingCard}>
                <View style={styles.trackingHeader}>
                  <Text style={styles.trackingOrderId}>{trackingResult.id}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>
                      {trackingResult.status?.toUpperCase().replace('_', ' ')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.courierText}>
                  Courier: {trackingResult.courierName || 'BlueDart Express'} • AWB: {trackingResult.trackingNumber || 'BD-DEL-8921'}
                </Text>

                <View style={styles.milestonesContainer}>
                  {(trackingResult.milestones || [
                    { status: 'Order Placed', timestamp: 'Today, 10:30 AM', completed: true },
                    { status: 'Supplier Confirmed', timestamp: 'Today, 11:15 AM', completed: true },
                    { status: 'Packed & Dispatched', timestamp: 'Today, 02:40 PM', completed: true },
                    { status: 'In Transit via BlueDart', timestamp: 'Today, 05:20 PM', completed: true },
                    { status: 'Out for Delivery', timestamp: 'Pending', completed: false },
                  ]).map((m: any, i: number) => (
                    <View key={i} style={styles.milestoneItem}>
                      <View style={[styles.milestoneDot, m.completed && styles.milestoneDotDone]} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.milestoneTitle, m.completed && styles.milestoneTitleDone]}>
                          {m.status}
                        </Text>
                        <Text style={styles.milestoneTime}>{m.timestamp}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* MODAL 1: PREPAID CHECKOUT SHEET */}
      {checkoutProduct && (
        <View style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: '#16161F',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            borderTopWidth: 1,
            borderColor: '#C5A059',
            maxHeight: '90%',
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <View>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#C5A059', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Prepaid Checkout • 100% Secure
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#FBF9F5' }} numberOfLines={1}>
                  {checkoutProduct.title}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setCheckoutProduct(null)} style={{ padding: 4 }}>
                <Ionicons name="close" size={20} color="#A8A29E" />
              </TouchableOpacity>
            </View>

            {/* Price summary */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 12,
              backgroundColor: '#1C1917',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#292524',
              marginBottom: 14,
            }}>
              <Text style={{ fontSize: 12, color: '#A8A29E' }}>Order Total (GST Included):</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#C5A059' }}>
                ₹{checkoutProduct.price?.toLocaleString('en-IN')}
              </Text>
            </View>

            {/* Address Inputs */}
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#D6D3D1', marginBottom: 6 }}>
              Shipping Details (Pan-India):
            </Text>
            <View style={{ gap: 8, marginBottom: 14 }}>
              <TextInput
                style={{ backgroundColor: '#1C1917', borderWidth: 1, borderColor: '#292524', borderRadius: 8, padding: 10, color: '#FBF9F5', fontSize: 12 }}
                placeholder="Full Name"
                placeholderTextColor="#78716C"
                value={checkoutAddress.name}
                onChangeText={(t) => setCheckoutAddress((p) => ({ ...p, name: t }))}
              />
              <TextInput
                style={{ backgroundColor: '#1C1917', borderWidth: 1, borderColor: '#292524', borderRadius: 8, padding: 10, color: '#FBF9F5', fontSize: 12 }}
                placeholder="Mobile (+91)"
                placeholderTextColor="#78716C"
                value={checkoutAddress.phone}
                onChangeText={(t) => setCheckoutAddress((p) => ({ ...p, phone: t }))}
                keyboardType="phone-pad"
              />
              <TextInput
                style={{ backgroundColor: '#1C1917', borderWidth: 1, borderColor: '#292524', borderRadius: 8, padding: 10, color: '#FBF9F5', fontSize: 12 }}
                placeholder="Delivery Address"
                placeholderTextColor="#78716C"
                value={checkoutAddress.address}
                onChangeText={(t) => setCheckoutAddress((p) => ({ ...p, address: t }))}
              />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                  style={{ flex: 1, backgroundColor: '#1C1917', borderWidth: 1, borderColor: '#292524', borderRadius: 8, padding: 10, color: '#FBF9F5', fontSize: 12 }}
                  placeholder="City"
                  placeholderTextColor="#78716C"
                  value={checkoutAddress.city}
                  onChangeText={(t) => setCheckoutAddress((p) => ({ ...p, city: t }))}
                />
                <TextInput
                  style={{ flex: 1, backgroundColor: '#1C1917', borderWidth: 1, borderColor: '#292524', borderRadius: 8, padding: 10, color: '#FBF9F5', fontSize: 12 }}
                  placeholder="Pincode"
                  placeholderTextColor="#78716C"
                  value={checkoutAddress.pincode}
                  onChangeText={(t) => setCheckoutAddress((p) => ({ ...p, pincode: t }))}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* Payment Method Selector */}
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#D6D3D1', marginBottom: 6 }}>
              Payment Method (Prepaid Only):
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              {(['upi', 'card', 'netbanking'] as const).map((method) => {
                const isSelected = checkoutPaymentMethod === method;
                return (
                  <TouchableOpacity
                    key={method}
                    onPress={() => setCheckoutPaymentMethod(method)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 8,
                      backgroundColor: isSelected ? '#C5A059' : '#1C1917',
                      borderWidth: 1,
                      borderColor: isSelected ? '#C5A059' : '#292524',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '800', color: isSelected ? '#0C0C0E' : '#A8A29E', textTransform: 'uppercase' }}>
                      {method}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Pay Button */}
            <TouchableOpacity
              onPress={handleExecutePrepaidOrder}
              disabled={isPlacingOrder}
              style={{
                backgroundColor: '#C5A059',
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isPlacingOrder ? (
                <ActivityIndicator color="#0C0C0E" size="small" />
              ) : (
                <Text style={{ fontSize: 14, fontWeight: '900', color: '#0C0C0E' }}>
                  Pay ₹{checkoutProduct.price?.toLocaleString('en-IN')} & Confirm Order
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* MODAL 2: ORDER CONFIRMATION SUCCESS */}
      {orderConfirmed && (
        <View style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: '#16161F',
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: '#10B981',
            width: '100%',
            maxWidth: 400,
            alignItems: 'center',
          }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(16, 185, 129, 0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Ionicons name="checkmark-circle" size={32} color="#10B981" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 4, textAlign: 'center' }}>
              Order Confirmed & Routed!
            </Text>
            <Text style={{ fontSize: 12, color: '#A8A29E', textAlign: 'center', marginBottom: 16 }}>
              Your order has been verified and automated purchase order dispatched to our Indian artisanal partner.
            </Text>

            <View style={{ width: '100%', backgroundColor: '#1C1917', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#292524', marginBottom: 16 }}>
              <Text style={{ fontSize: 11, color: '#A8A29E' }}>Order Reference:</Text>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#C5A059', fontFamily: 'monospace' }}>
                {orderConfirmed.id}
              </Text>
              <Text style={{ fontSize: 11, color: '#10B981', fontWeight: '700', marginTop: 4 }}>
                Status: {orderConfirmed.status?.toUpperCase() || 'SUPPLIER ROUTED'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setTrackingId(orderConfirmed.id);
                setOrderConfirmed(null);
                setActiveSegment('tracker');
              }}
              style={{
                width: '100%',
                backgroundColor: '#C5A059',
                paddingVertical: 12,
                borderRadius: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#0C0C0E' }}>
                Track Order Milestones
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A22',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFD43B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0C0C0E',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888899',
  },
  segmentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#121218',
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1A1A22',
  },
  segmentBtnActive: {
    backgroundColor: '#262635',
    borderWidth: 1,
    borderColor: '#FFD43B',
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888899',
  },
  segmentBtnTextActive: {
    color: '#FFD43B',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#16161F',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262635',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#888899',
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#0C0C0E',
    borderWidth: 1,
    borderColor: '#262635',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#FFFFFF',
  },
  pasteBtn: {
    padding: 11,
    backgroundColor: '#1A1A26',
    borderWidth: 1,
    borderColor: '#2E2E42',
    borderRadius: 8,
  },
  actionBtn: {
    backgroundColor: '#FFD43B',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0C0C0E',
  },
  resultsContainer: {
    marginTop: 8,
  },
  productHeroCard: {
    backgroundColor: '#16161F',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#262635',
    marginBottom: 12,
  },
  productThumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#0C0C0E',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  specBadge: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  specBadgeText: {
    fontSize: 10,
    color: '#34D399',
    fontWeight: '700',
  },
  mrpText: {
    fontSize: 12,
    color: '#888899',
    textDecorationLine: 'line-through',
  },
  savingsBanner: {
    backgroundColor: '#0E221E',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  savingsLabel: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  savingsPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  savingsHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10B981',
  },
  savingsSub: {
    fontSize: 10,
    color: '#888899',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888899',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  platformRow: {
    backgroundColor: '#16161F',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262635',
    marginBottom: 8,
  },
  platformRowCheapest: {
    borderColor: '#10B981',
    backgroundColor: '#121F1C',
  },
  platformName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cheapestBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cheapestBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0C0C0E',
  },
  deliveryText: {
    fontSize: 11,
    color: '#888899',
    marginTop: 4,
  },
  platformPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  discountText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  trendingCard: {
    backgroundColor: '#16161F',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#262635',
    marginBottom: 10,
  },
  trendingImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#0C0C0E',
  },
  trendingInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  trendingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trendingCategory: {
    fontSize: 11,
    color: '#888899',
  },
  trendingPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trendingPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFD43B',
  },
  trendingVerified: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  trackingCard: {
    backgroundColor: '#16161F',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262635',
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  trackingOrderId: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFD43B',
  },
  statusBadge: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    color: '#34D399',
    fontWeight: '700',
  },
  courierText: {
    fontSize: 12,
    color: '#888899',
    marginBottom: 16,
  },
  milestonesContainer: {
    gap: 16,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  milestoneDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333344',
    marginTop: 3,
  },
  milestoneDotDone: {
    backgroundColor: '#10B981',
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888899',
  },
  milestoneTitleDone: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  milestoneTime: {
    fontSize: 11,
    color: '#666677',
    marginTop: 2,
  },
});

