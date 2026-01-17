import { AdaptiveHero } from "@/components/home/AdaptiveHero";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { DualScrollLayout } from "@/components/shop/DualScrollLayout";
import { DiscoveryZone } from "@/components/shop/DiscoveryZone";
import { getCollections } from "@/lib/shopify";

// Mock Data for Demo
const FASHION_PRODUCTS = [
  { id: 'f1', title: 'Neon Trench', price: '$250.00', image: '', category: 'fashion' },
  { id: 'f2', title: 'Void Weaver', price: '$180.00', image: '', category: 'fashion' },
  { id: 'f3', title: 'Cyber Silk', price: '$320.00', image: '', category: 'fashion' },
] as const;

const TECH_PRODUCTS = [
  { id: 't1', title: 'Quantum Visor', price: '$800.00', image: '', category: 'electronics' },
  { id: 't2', title: 'Haptic Glove', price: '$450.00', image: '', category: 'electronics' },
  { id: 't3', title: 'Neural Link', price: '$1200.00', image: '', category: 'electronics' },
] as const;

export default async function Home() {
  const collections = await getCollections();

  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. Adaptive Entry Point - Starts Mixed/Electronics */}
      <AdaptiveHero />

      <DualScrollLayout>

        {/* 2. Fashion Reality Zone (Vertical Scroll) */}
        <section
          data-switch-mode="fashion"
          className="min-h-screen py-32 px-4 relative bg-[#0a0505]"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-6xl md:text-8xl font-serif italic text-white/20 mb-16 text-center">
              The Fabric of <span className="text-primary">Time</span>
            </h2>

            <DiscoveryZone products={FASHION_PRODUCTS} className="grid grid-cols-1 md:grid-cols-3 gap-8" />
          </div>
        </section>

        {/* 3. Electronics Reality Zone (Horizontal-ish feel via grid) */}
        <section
          data-switch-mode="electronics"
          className="min-h-screen py-32 px-4 relative bg-black"
        >
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50 pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-5xl md:text-7xl font-mono uppercase tracking-widest text-white/80 mb-16 text-right">
              <span className="text-secondary">&lt;</span> System_Upgrades <span className="text-secondary">/&gt;</span>
            </h2>

            <DiscoveryZone products={TECH_PRODUCTS} className="grid grid-cols-1 md:grid-cols-3 gap-8" />
          </div>
        </section>

      </DualScrollLayout>

      <NewsletterSection />

      {/* Brand Statement / Spacer */}
      <section className="py-24 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white/50 tracking-wider">
          ENGINEERED FOR THE EXTRAORDINARY
        </h2>
      </section>
    </main>
  );
}
