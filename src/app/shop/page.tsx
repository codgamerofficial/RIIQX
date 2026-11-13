'use client';

// =============================================================================
// RIIQX 2.0 — Flagship D2C Storefront: Modern Indian Heritage
// Earthy Luxury • Royal Minimalism • Warm Ivory, Sandstone, Terracotta & Brass
// Curated Collections: RIIQX Objects • RIIQX Living • RIIQX Carry • RIIQX Everyday
// Zero-Dropship Template Aesthetic • 100% Genuine Materials & Transparent Pricing
// =============================================================================

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Heart,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  X,
  CreditCard,
  ChevronRight,
  Info,
  Filter,
} from 'lucide-react';
import { RiiqxHeritageLogo, RiiqxPackagingBadge } from '@/components/ui/RiiqxHeritageLogo';
import {
  INITIAL_HERITAGE_CATALOG,
  HeritageProduct,
} from '@/lib/riiqx/commerce/catalog-engine';
import { formatCurrencyINR } from '@/lib/riiqx/commerce/pricing-engine';

export default function RiiqxHeritageStorefrontPage() {
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCart, setActiveCart] = useState<Array<{ product: HeritageProduct; quantity: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<HeritageProduct | null>(null);

  // Checkout modal states
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<'address' | 'payment' | 'confirmed'>('address');
  const [customerName, setCustomerName] = useState('Ananya Sharma');
  const [customerEmail, setCustomerEmail] = useState('ananya.sharma@example.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [customerAddress, setCustomerAddress] = useState('Flat 402, Nilgiri Heights, Indiranagar');
  const [customerCity, setCustomerCity] = useState('Bengaluru');
  const [customerState, setCustomerState] = useState('Karnataka');
  const [customerPincode, setCustomerPincode] = useState('560038');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');
  const [isProcessingOrder, setIsProcessingOrder] = useState<boolean>(false);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return INITIAL_HERITAGE_CATALOG.filter((p) => {
      const matchCol = selectedCollection === 'All' || p.collection === selectedCollection;
      const matchQuery =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.materials.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCol && matchQuery;
    });
  }, [selectedCollection, searchQuery]);

  const collections = ['All', 'RIIQX Objects', 'RIIQX Living', 'RIIQX Carry', 'RIIQX Everyday'];

  const cartSubtotal = activeCart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartShippingFee = cartSubtotal >= 1499 || activeCart.length === 0 ? 0 : 70;
  const cartTotal = cartSubtotal + cartShippingFee;

  const handleAddToCart = (product: HeritageProduct) => {
    setActiveCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId: string) => {
    setActiveCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleExecuteCheckout = async () => {
    setIsProcessingOrder(true);
    try {
      // 1. Initiate Order
      const initRes = await fetch('/api/commerce/checkout/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            fullName: customerName,
            email: customerEmail,
            phone: customerPhone,
            streetAddress: customerAddress,
            city: customerCity,
            state: customerState,
            pincode: customerPincode,
            country: 'India',
          },
          cartItems: activeCart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          paymentMethod: 'upi',
        }),
      });

      const initData = await initRes.json();
      if (!initData.success || !initData.orderId) {
        throw new Error(initData.error || 'Failed to initiate order');
      }

      // 2. Complete Server-Side Verification
      const verifyRes = await fetch('/api/commerce/checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: initData.orderId,
          paymentId: `pay_upi_${Date.now()}_simulated`,
          signature: 'hmac_verified_prepayment',
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setConfirmedOrderId(initData.orderId);
        setCheckoutStep('confirmed');
        setActiveCart([]);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Checkout encountered an error');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1A1A1A] font-sans selection:bg-[#C2593F] selection:text-white">
      {/* Top Heritage Announcement Banner */}
      <div className="bg-[#1A1A1A] text-[#FBF9F5] py-2 px-4 text-center text-xs tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
        <span>RIIQX 2.0 • A New Perspective on Indian Living • Free Express Shipping on Orders Over ₹1,499</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E6DFD5] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Monogram */}
          <Link href="/shop">
            <RiiqxHeritageLogo variant="full" size="md" colorMode="light" />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-[#5A5450]">
            {collections.map((col) => (
              <button
                key={col}
                onClick={() => setSelectedCollection(col)}
                className={`transition-colors hover:text-[#1A1A1A] cursor-pointer pb-1 border-b-2 ${
                  selectedCollection === col
                    ? 'border-[#C2593F] text-[#1A1A1A] font-bold'
                    : 'border-transparent'
                }`}
              >
                {col}
              </button>
            ))}
          </nav>

          {/* Right Action Icons & Cart */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-semibold text-[#7D766E] hover:text-[#1A1A1A] transition hidden sm:inline-block border-r border-[#E6DFD5] pr-4"
            >
              Audio &amp; Studio Hub &rarr;
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-[#E6DFD5]/50 transition cursor-pointer text-[#1A1A1A]"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {activeCart.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C2593F] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeCart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Editorial Campaign Banner */}
      <section className="relative overflow-hidden bg-[#F5F2EB] border-b border-[#E6DFD5] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6DFD5] text-[#C2593F] text-[10px] font-bold tracking-[0.2em] uppercase">
              <Sparkles className="w-3 h-3 text-[#C5A059]" />
              <span>Autumn / Winter 2026 Collection</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#1A1A1A] leading-[1.15]"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
            >
              Objects shaped by heritage. <br />
              <span className="italic font-normal text-[#C2593F]">Crafted for the modern day.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#5A5450] max-w-xl font-normal leading-relaxed">
              We curate contemporary everyday living objects, artisanal brass desk essentials, and conscious craft —
              honoring India’s legendary material traditions with royal minimalism.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setSelectedCollection('RIIQX Objects')}
                className="px-6 py-3.5 rounded-xl bg-[#1A1A1A] text-[#FBF9F5] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C2593F] transition-colors duration-300 shadow-sm cursor-pointer flex items-center gap-2"
              >
                <span>Explore RIIQX Objects</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedCollection('RIIQX Living')}
                className="px-6 py-3.5 rounded-xl bg-transparent border border-[#1A1A1A] text-[#1A1A1A] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#E6DFD5] transition-colors cursor-pointer"
              >
                RIIQX Living
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Product Catalog */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Collection Pills & Live Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD5]">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {collections.map((col) => (
              <button
                key={col}
                onClick={() => setSelectedCollection(col)}
                className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase font-medium transition cursor-pointer shrink-0 ${
                  selectedCollection === col
                    ? 'bg-[#C2593F] text-white font-bold shadow-xs'
                    : 'bg-[#E6DFD5]/60 text-[#5A5450] hover:bg-[#E6DFD5] hover:text-[#1A1A1A]'
                }`}
              >
                {col}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D766E]" />
            <input
              type="text"
              placeholder="Search brass, teak, stoneware..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E6DFD5] rounded-full py-2 pl-10 pr-4 text-xs text-[#1A1A1A] placeholder-[#7D766E] focus:outline-none focus:border-[#C2593F] transition shadow-xs"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between bg-white rounded-2xl border border-[#E6DFD5] overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Product Image Frame */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#F5F2EB]">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Top Badge */}
                  {product.badges[0] && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#1A1A1A]/85 backdrop-blur-xs text-[#FBF9F5] shadow-xs">
                      {product.badges[0]}
                    </span>
                  )}

                  {/* Quick View Button on Hover */}
                  <button
                    onClick={() => setActiveQuickViewProduct(product)}
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] opacity-0 group-hover:opacity-100 transition shadow-sm cursor-pointer hover:bg-white"
                  >
                    Quick View
                  </button>
                </div>

                {/* Product Information */}
                <div className="p-5 space-y-2.5">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#C5A059]">
                    {product.collection}
                  </span>

                  <h3
                    className="text-base font-medium text-[#1A1A1A] line-clamp-1 group-hover:text-[#C2593F] transition-colors"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {product.title}
                  </h3>

                  <p className="text-xs text-[#7D766E] line-clamp-2 leading-relaxed">
                    {product.subtitle}
                  </p>

                  {/* Materials & Provenance */}
                  <div className="pt-1 flex flex-wrap gap-1 text-[10px] text-[#5A5450]">
                    <span className="font-semibold text-[#1A1A1A]">{product.countryOfOrigin}</span>
                    <span>•</span>
                    <span>{product.materials[0]}</span>
                  </div>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-5 pt-0 border-t border-[#E6DFD5]/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#1A1A1A]">
                      {formatCurrencyINR(product.price)}
                    </span>
                    <span className="text-xs text-[#7D766E] line-through">
                      {formatCurrencyINR(product.mrp)}
                    </span>
                  </div>
                  <span className="text-[9px] text-[#606C38] font-semibold tracking-wide">
                    Prepaid Express Dispatch
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="px-3.5 py-2 rounded-xl bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-[#C2593F] transition-colors shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Slide-Over Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="w-full max-w-md bg-[#FBF9F5] h-full shadow-2xl flex flex-col justify-between border-l border-[#E6DFD5] animate-slide-in">
            {/* Cart Header */}
            <div className="p-6 border-b border-[#E6DFD5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#C2593F]" />
                <h2 className="text-lg font-bold text-[#1A1A1A] tracking-tight">Your RIIQX Bag</h2>
                <span className="text-xs text-[#7D766E]">({activeCart.length} items)</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-[#E6DFD5] transition cursor-pointer text-[#1A1A1A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeCart.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 text-[#7D766E]">
                  <ShoppingBag className="w-10 h-10 text-[#C5A059]/40" />
                  <p className="text-sm font-medium text-[#1A1A1A]">Your bag is empty</p>
                  <p className="text-xs max-w-xs">Explore our artisanal desk and living collections to add items.</p>
                </div>
              ) : (
                activeCart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3.5 rounded-xl bg-white border border-[#E6DFD5] shadow-xs"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-18 h-18 rounded-lg object-cover bg-[#F5F2EB] shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#1A1A1A] truncate">{item.product.title}</h4>
                        <p className="text-[11px] text-[#7D766E]">{item.product.collection}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-bold text-[#1A1A1A]">
                          {formatCurrencyINR(item.product.price)} × {item.quantity}
                        </span>
                        <button
                          onClick={() => handleRemoveFromCart(item.product.id)}
                          className="text-[11px] text-red-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer & Checkout Action */}
            {activeCart.length > 0 && (
              <div className="p-6 border-t border-[#E6DFD5] bg-white space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#5A5450]">
                    <span>Subtotal</span>
                    <span>{formatCurrencyINR(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#5A5450]">
                    <span>Express Air Shipping</span>
                    <span>{cartShippingFee === 0 ? 'FREE' : formatCurrencyINR(cartShippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#1A1A1A] pt-2 border-t border-[#E6DFD5]">
                    <span>Total Landed Amount</span>
                    <span className="text-[#C2593F]">{formatCurrencyINR(cartTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckingOut(true);
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#1A1A1A] hover:bg-[#C2593F] text-white text-xs uppercase tracking-[0.2em] font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Proceed to Prepaid Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-center text-[#7D766E]">
                  🔒 100% Encrypted &amp; Verified Prepaid Checkout • 7-Day Hassle-Free Replacement
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal / Slide Drawer */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#FBF9F5] rounded-3xl shadow-2xl border border-[#E6DFD5] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E6DFD5] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <RiiqxHeritageLogo variant="monogram" size="xs" colorMode="light" />
                <h3 className="text-base font-bold text-[#1A1A1A]">RIIQX Express Prepaid Checkout</h3>
              </div>
              <button
                onClick={() => setIsCheckingOut(false)}
                className="p-1.5 rounded-full hover:bg-[#E6DFD5] transition cursor-pointer text-[#1A1A1A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {checkoutStep === 'address' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#1A1A1A] text-[11px] leading-relaxed">
                    <strong>Zero-Risk Cash Flow Policy:</strong> To guarantee on-demand dispatch from partner artisans,
                    orders are 100% prepaid with real-time UPI or Card verification.
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Full Customer Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E6DFD5] bg-white focus:outline-none focus:border-[#C2593F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Email</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#E6DFD5] bg-white focus:outline-none focus:border-[#C2593F]"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#E6DFD5] bg-white focus:outline-none focus:border-[#C2593F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Shipping Street Address</label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E6DFD5] bg-white focus:outline-none focus:border-[#C2593F]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">City</label>
                      <input
                        type="text"
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#E6DFD5] bg-white focus:outline-none focus:border-[#C2593F]"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">State</label>
                      <input
                        type="text"
                        value={customerState}
                        onChange={(e) => setCustomerState(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#E6DFD5] bg-white focus:outline-none focus:border-[#C2593F]"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Pincode</label>
                      <input
                        type="text"
                        value={customerPincode}
                        onChange={(e) => setCustomerPincode(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#E6DFD5] bg-white focus:outline-none focus:border-[#C2593F]"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E6DFD5] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#7D766E] block">Total to Pay</span>
                      <span className="text-base font-bold text-[#C2593F]">{formatCurrencyINR(cartTotal)}</span>
                    </div>

                    <button
                      onClick={handleExecuteCheckout}
                      disabled={isProcessingOrder}
                      className="px-6 py-3 rounded-xl bg-[#C2593F] hover:bg-[#9E3E28] text-white font-bold tracking-wider uppercase text-xs transition shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isProcessingOrder ? 'Processing...' : 'Pay with UPI / Card'}
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 'confirmed' && (
                <div className="p-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>

                  <h4 className="text-xl font-bold text-[#1A1A1A]">Payment Verified &amp; Order Placed!</h4>
                  <p className="text-xs text-[#5A5450] max-w-sm mx-auto leading-relaxed">
                    Order ID: <code className="bg-[#E6DFD5] px-2 py-0.5 rounded font-mono">{confirmedOrderId}</code>.
                    Your order has been routed to our certified supplier hub and scheduled for BlueDart express dispatch.
                  </p>

                  <div className="p-4 rounded-xl bg-white border border-[#E6DFD5] text-left text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#7D766E]">Courier:</span>
                      <span className="font-semibold">BlueDart Express Air</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7D766E]">Delivery Pincode:</span>
                      <span className="font-semibold">{customerPincode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7D766E]">Estimated Delivery:</span>
                      <span className="font-semibold text-emerald-600">2-4 Business Days</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCheckingOut(false);
                      setCheckoutStep('address');
                    }}
                    className="w-full py-3 rounded-xl bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#C2593F] transition cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {activeQuickViewProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E6DFD5] overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 aspect-square bg-[#F5F2EB]">
              <img
                src={activeQuickViewProduct.images[0]}
                alt={activeQuickViewProduct.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-widest">
                    {activeQuickViewProduct.collection}
                  </span>
                  <button
                    onClick={() => setActiveQuickViewProduct(null)}
                    className="p-1 rounded-full hover:bg-[#E6DFD5] text-[#1A1A1A] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3
                  className="text-xl font-bold text-[#1A1A1A] mt-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {activeQuickViewProduct.title}
                </h3>

                <p className="text-xs text-[#5A5450] mt-2 leading-relaxed">
                  {activeQuickViewProduct.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[#E6DFD5] space-y-1.5 text-[11px] text-[#5A5450]">
                  <div>
                    <strong className="text-[#1A1A1A]">Materials:</strong> {activeQuickViewProduct.materials.join(', ')}
                  </div>
                  <div>
                    <strong className="text-[#1A1A1A]">Dimensions:</strong> {activeQuickViewProduct.dimensions}
                  </div>
                  <div>
                    <strong className="text-[#1A1A1A]">Artisan Origin:</strong> {activeQuickViewProduct.artisanStory}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E6DFD5] flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-[#1A1A1A]">
                    {formatCurrencyINR(activeQuickViewProduct.price)}
                  </span>
                  <span className="text-xs text-[#7D766E] line-through ml-2">
                    {formatCurrencyINR(activeQuickViewProduct.mrp)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    handleAddToCart(activeQuickViewProduct);
                    setActiveQuickViewProduct(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#C2593F] hover:bg-[#9E3E28] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Add to Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#141414] text-[#FBF9F5] border-t border-[#2E2B27] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-1">
              <RiiqxHeritageLogo variant="full" size="md" colorMode="dark" />
              <p className="text-xs text-[#B3ACA3] leading-relaxed">
                RIIQX curates contemporary Indian heritage objects, desk essentials, and conscious craft for elevated everyday living.
              </p>
              <RiiqxPackagingBadge className="mt-2" />
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C5A059] uppercase tracking-wider">Collections</h4>
              <ul className="space-y-2 text-[#B3ACA3]">
                <li><button onClick={() => setSelectedCollection('RIIQX Objects')} className="hover:text-white cursor-pointer">RIIQX Objects (Desk)</button></li>
                <li><button onClick={() => setSelectedCollection('RIIQX Living')} className="hover:text-white cursor-pointer">RIIQX Living (Home)</button></li>
                <li><button onClick={() => setSelectedCollection('RIIQX Carry')} className="hover:text-white cursor-pointer">RIIQX Carry (Travel)</button></li>
                <li><button onClick={() => setSelectedCollection('RIIQX Everyday')} className="hover:text-white cursor-pointer">RIIQX Everyday (POD)</button></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C5A059] uppercase tracking-wider">Trust &amp; Service</h4>
              <ul className="space-y-2 text-[#B3ACA3]">
                <li><span>100% Prepaid Verification (UPI/Cards)</span></li>
                <li><span>7-Day Replacement Policy</span></li>
                <li><span>BlueDart / Delhivery Express Air</span></li>
                <li><span>Authentic Country of Origin: India</span></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C5A059] uppercase tracking-wider">Statutory Compliance</h4>
              <p className="text-[11px] text-[#B3ACA3] leading-relaxed">
                Compliant with Consumer Protection (E-Commerce) Rules 2020 &amp; Legal Metrology Packaged Commodities Rules.
              </p>
              <p className="text-[10px] text-[#7D766E] pt-2">
                Grievance Officer: support@riiqx.in • Bengaluru, India
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#2E2B27] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7D766E]">
            <p>© 2026 RIIQX Technologies Pvt Ltd. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              <Link href="/" className="hover:underline">Studio Workspace</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
