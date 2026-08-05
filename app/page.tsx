import React from 'react';
import { fetchFeaturedProducts, fetchCategories } from '@/lib/db/homepage';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CinematicHero } from '@/components/home/CinematicHero';
import { FeaturedDropsGrid } from '@/components/home/FeaturedDropsGrid';
import { ParallaxLookbook } from '@/components/home/ParallaxLookbook';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { DropCountdown } from '@/components/home/DropCountdown';

export const revalidate = 3600; // Cache revalidation every 1 hour

export default async function HomePage() {
  // Concurrent Server-Side Data Fetching
  const [products, categories] = await Promise.all([
    fetchFeaturedProducts(),
    fetchCategories(),
  ]);

  return (
    <div className="min-h-screen bg-obsidian-base text-riiqxText-primary selection:bg-accent-crimson selection:text-white flex flex-col justify-between">
      {/* Global Layout Header */}
      <Navbar />

      {/* Main Homepage Sections */}
      <main className="space-y-24 pb-20">
        <CinematicHero />
        <FeaturedDropsGrid products={products} />
        <ParallaxLookbook />
        <CategoryGrid categories={categories} />
        <DropCountdown />
      </main>

      {/* Global Layout Footer */}
      <Footer />
    </div>
  );
}
