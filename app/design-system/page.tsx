'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Switch } from '@/components/ui/Switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Heading, Text } from '@/components/ui/Typography';

import { MagneticButton } from '@/components/motion/MagneticButton';
import { GlassDrawer } from '@/components/motion/GlassDrawer';
import { ParallaxContainer } from '@/components/motion/ParallaxContainer';
import { SkeletonLoader } from '@/components/motion/SkeletonLoader';

import {
  ShieldCheck,
  Zap,
  ShoppingBag,
  Terminal,
  Layers,
  Sparkles,
  ArrowRight,
  Lock,
  Cpu,
  Eye,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export default function DesignSystemPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState('batch-004');
  const [isNfcEnabled, setIsNfcEnabled] = useState(true);
  const [isStealthMode, setIsStealthMode] = useState(false);
  const [inputValue, setInputValue] = useState('0x8F9A2C7B_PROTOTYPE');
  const [inputStatus, setInputStatus] = useState<'default' | 'success' | 'error' | 'warning'>('success');

  const deploymentOptions = [
    { value: 'batch-004', label: 'BATCH 004 // TACTICAL FLEECE (500 GSM)', badge: 'LIMITED' },
    { value: 'batch-003', label: 'BATCH 003 // CYBERNETIC BOMBER JACKET', badge: 'PRE-ORDER' },
    { value: 'batch-002', label: 'BATCH 002 // ANODIZED TITANIUM RIGID TAG', badge: 'SOLD OUT', disabled: true },
    { value: 'batch-001', label: 'BATCH 001 // OMNI-CARGO PANTS (WATERPROOF)', badge: 'RESTOCK' },
  ];

  return (
    <div className="min-h-screen bg-obsidian-base text-riiqxText-primary selection:bg-accent-crimson selection:text-white pb-24">
      {/* Background Decorative Scanlines */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#1e2030_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-obsidian-base/80 backdrop-blur-xl border-b border-glass-border-subtle px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-accent-crimson flex items-center justify-center shadow-glow-crimson font-mono font-black text-white text-base">
              R
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg tracking-wider text-white">
                RIIQX
              </span>
              <span className="font-mono text-[10px] text-accent-cyan tracking-widest uppercase">
                SYSTEM CORE // DESIGN SPEC
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="cyan" dot shape="chamfer">
              v1.0.0 STABLE
            </Badge>
            <Badge variant="crimson" dot shape="pill">
              DARK MODE OPERATIONAL
            </Badge>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
              onClick={() => setIsDrawerOpen(true)}
            >
              BAG (1)
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-12 space-y-16 relative z-10">
        {/* HERO SECTION */}
        <section className="relative rounded-lg p-8 md:p-12 bg-charcoal-matte/50 backdrop-blur-2xl border border-glass-border-medium overflow-hidden shadow-glass-lg">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-crimson/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="lime" dot>
                TACTICAL DESIGN SYSTEM
              </Badge>
              <span className="font-mono text-xs text-riiqxText-muted">// VERIFICATION GUIDE</span>
            </div>

            <Heading size="5xl" font="display" gradient>
              RIIQX COMPONENT LIBRARY
            </Heading>

            <Text size="lg" variant="secondary">
              A high-performance, dark-mode technical UI design system built for luxury streetwear, cybernetic minimalism, and modern micro-interactions.
            </Text>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <MagneticButton onClick={() => setIsDrawerOpen(true)}>
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  TEST GLASS DRAWER
                </Button>
              </MagneticButton>

              <Button
                variant="outline"
                size="lg"
                leftIcon={<Terminal className="w-4 h-4 text-accent-cyan" />}
                onClick={() => alert('Tokens file located at: d:\\RIIQX\\tokens.css')}
              >
                VIEW DESIGN TOKENS
              </Button>
            </div>
          </div>
        </section>

        {/* SECTION 1: TYPOGRAPHY & BADGES */}
        <section className="space-y-6">
          <div className="border-b border-glass-border-subtle pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-cyan" />
              <Heading size="xl" font="display">
                01 // TYPOGRAPHY & BADGES
              </Heading>
            </div>
            <span className="font-mono text-xs text-riiqxText-muted">TOKENS.CSS COMPLIANT</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Typography Scale Card */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Typography System</CardTitle>
                <CardDescription>Display, Sans, and Technical Monospaced Stacks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="font-mono text-[10px] text-riiqxText-muted uppercase">Display Heading 6XL</span>
                  <Heading size="4xl" font="display" className="text-white">
                    RIIQX LABS
                  </Heading>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-riiqxText-muted uppercase">Sans Body LG</span>
                  <Text size="lg" variant="secondary">
                    Precision technical garments crafted with 500 GSM organic cotton and laser-engraved titanium hardware.
                  </Text>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-accent-cyan uppercase">Technical Mono (xs + tracking)</span>
                  <p className="font-mono text-xs text-accent-cyan tracking-widest uppercase">
                    SYS_ID: 0x994F // LATITUDE 37.7749 // LONGITUDE -122.4194
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Badges & Tags Matrix */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Status Badges & Micro Tags</CardTitle>
                <CardDescription>Contextual indicators across drops and UI states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <span className="font-mono text-xs text-riiqxText-muted block">Variants (Chamfered):</span>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="crimson" dot>LIMITED DROP</Badge>
                    <Badge variant="cyan" dot>SYSTEM OK</Badge>
                    <Badge variant="lime" dot>150 UNITS LEFT</Badge>
                    <Badge variant="voltage" dot>WEB3 VERIFIED</Badge>
                    <Badge variant="glass">PRE-ORDER</Badge>
                    <Badge variant="neutral">OUT OF STOCK</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-xs text-riiqxText-muted block">Shapes (Pill & Square):</span>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="crimson" shape="pill" dot>PILL CRIMSON</Badge>
                    <Badge variant="cyan" shape="square" dot>SQUARE CYAN</Badge>
                    <Badge variant="lime" shape="pill">PILL LIME</Badge>
                    <Badge variant="outline" shape="square">SQUARE OUTLINE</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION 2: BUTTON PRIMITIVES */}
        <section className="space-y-6">
          <div className="border-b border-glass-border-subtle pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent-crimson" />
              <Heading size="xl" font="display">
                02 // CORE ATOMIC BUTTONS
              </Heading>
            </div>
            <span className="font-mono text-xs text-riiqxText-muted">BUTTON.TSX</span>
          </div>

          <Card variant="glass">
            <CardContent className="space-y-8 pt-4">
              {/* Button Variants */}
              <div className="space-y-3">
                <span className="font-mono text-xs text-riiqxText-muted block">Button Variants:</span>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" leftIcon={<ShieldCheck className="w-4 h-4" />}>
                    PRIMARY CRIMSON
                  </Button>
                  <Button variant="cyan" leftIcon={<Zap className="w-4 h-4" />}>
                    CYAN ACCENT
                  </Button>
                  <Button variant="secondary">SECONDARY GLASS</Button>
                  <Button variant="outline">OUTLINE</Button>
                  <Button variant="danger">DANGER</Button>
                  <Button variant="ghost">GHOST</Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div className="space-y-3">
                <span className="font-mono text-xs text-riiqxText-muted block">Sizes (SM, MD, LG):</span>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" size="sm">
                    SMALL (SM)
                  </Button>
                  <Button variant="primary" size="md">
                    MEDIUM (MD)
                  </Button>
                  <Button variant="primary" size="lg">
                    LARGE (LG)
                  </Button>
                </div>
              </div>

              {/* Loading States */}
              <div className="space-y-3">
                <span className="font-mono text-xs text-riiqxText-muted block">Loading Async States:</span>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" isLoading>
                    PROCESSING
                  </Button>
                  <Button variant="cyan" isLoading>
                    AUTHENTICATING
                  </Button>
                  <Button variant="secondary" isLoading>
                    LOADING BAG
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SECTION 3: FORM CONTROLS & INPUTS */}
        <section className="space-y-6">
          <div className="border-b border-glass-border-subtle pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-accent-lime" />
              <Heading size="xl" font="display">
                03 // INPUTS & FORM CONTROLS
              </Heading>
            </div>
            <span className="font-mono text-xs text-riiqxText-muted">FLOATING LABELS & STYLED CONTROLS</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input States */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Floating Label Inputs</CardTitle>
                <CardDescription>Dark glass interior with neon focus rings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <Input
                  label="AUTHENTICATION ID"
                  placeholder="e.g. USER-99201"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  status={inputStatus}
                  helperText="Verified against system registry hash."
                  leftIcon={<Lock className="w-4 h-4" />}
                />

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setInputStatus('success')}>
                    SET SUCCESS
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setInputStatus('error')}>
                    SET ERROR
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setInputStatus('warning')}>
                    SET WARNING
                  </Button>
                </div>

                <Input
                  label="ENCRYPTED ACCESS KEY"
                  type="password"
                  placeholder="••••••••••••"
                  leftIcon={<Cpu className="w-4 h-4" />}
                />
              </CardContent>
            </Card>

            {/* Select & Toggles */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Dropdowns & Toggles</CardTitle>
                <CardDescription>Custom Select dropdown, Checkbox, and Spring Switch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Select
                  label="SELECT SYSTEM BATCH DROP"
                  options={deploymentOptions}
                  value={selectedDeployment}
                  onChange={(val) => setSelectedDeployment(val)}
                />

                <div className="space-y-4 pt-2">
                  <Switch
                    label="ENABLE NFC HARDWARE LINK"
                    sublabel="Synchronize physical garment tag with digital certificate"
                    checked={isNfcEnabled}
                    onChange={(checked) => setIsNfcEnabled(checked)}
                  />

                  <Checkbox
                    label="STEALTH SHIPPING CONTAINER"
                    sublabel="Deliver in tamper-evident anti-static carbon bag"
                    checked={isStealthMode}
                    onChange={(checked) => setIsStealthMode(checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION 4: SURFACES & CARDS */}
        <section className="space-y-6">
          <div className="border-b border-glass-border-subtle pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <Heading size="xl" font="display">
                04 // GLASSMORPHISM SURFACES & CARDS
              </Heading>
            </div>
            <span className="font-mono text-xs text-riiqxText-muted">CARD.TSX</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card Variant 1 */}
            <Card variant="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="cyan">GLASS BASE</Badge>
                  <Eye className="w-4 h-4 text-riiqxText-muted" />
                </div>
                <CardTitle className="mt-2">Glassmorphism Card</CardTitle>
                <CardDescription>65% opacity charcoal backdrop with subtle border.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text size="sm" variant="secondary">
                  Designed to float above deep obsidian canvases with medium backdrop blur filter.
                </Text>
              </CardContent>
            </Card>

            {/* Card Variant 2 */}
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="crimson">ELEVATED</Badge>
                  <Zap className="w-4 h-4 text-accent-crimson" />
                </div>
                <CardTitle className="mt-2">Elevated Container</CardTitle>
                <CardDescription>High depth backdrop blur for popovers and drawers.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text size="sm" variant="secondary">
                  Provides high visual separation for active elements and primary focal points.
                </Text>
              </CardContent>
            </Card>

            {/* Card Variant 3 */}
            <Card variant="glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="crimson" dot>LASER GLOW</Badge>
                  <ShieldCheck className="w-4 h-4 text-accent-crimson" />
                </div>
                <CardTitle className="mt-2">Crimson Glow Card</CardTitle>
                <CardDescription>Ambient laser shadow glow for active drops.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text size="sm" variant="secondary">
                  Highlights high-priority releases, active cart items, and critical alerts.
                </Text>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION 5: MOTION LIBRARY */}
        <section className="space-y-6">
          <div className="border-b border-glass-border-subtle pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-accent-cyan" />
              <Heading size="xl" font="display">
                05 // MOTION LIBRARY SHOWCASE
              </Heading>
            </div>
            <span className="font-mono text-xs text-riiqxText-muted">FRAMER MOTION INTEGRATION</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Magnetic Button & Parallax Showcase */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Magnetic Cursor Tracking & Parallax</CardTitle>
                <CardDescription>Smooth 2D spring response on hover</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-md bg-obsidian-void border border-glass-border-subtle text-center space-y-4">
                  <span className="font-mono text-xs text-riiqxText-muted block">Hover your cursor over the CTA below:</span>
                  <MagneticButton>
                    <Button variant="cyan" size="lg" rightIcon={<Sparkles className="w-4 h-4" />}>
                      MAGNETIC CURSOR CTA
                    </Button>
                  </MagneticButton>
                </div>

                {/* Parallax Card */}
                <ParallaxContainer speed={3}>
                  <div className="p-6 rounded-md bg-gradient-to-r from-accent-crimson/20 via-charcoal-matte to-accent-cyan/20 border border-glass-border-medium">
                    <span className="font-mono text-xs text-accent-cyan">DEPTH_FACTOR // 3.0</span>
                    <Heading size="xl" font="display" className="mt-1">
                      PARALLAX LOOKBOOK SHOWCASE
                    </Heading>
                    <Text size="sm" variant="secondary" className="mt-2">
                      Subtle mouse and scroll-driven depth transformation for editorial streetwear cards.
                    </Text>
                  </div>
                </ParallaxContainer>
              </CardContent>
            </Card>

            {/* Skeleton Loader Feed */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Cyber Skeleton Placeholders</CardTitle>
                <CardDescription>Async loading shimmer with sweep scanlines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-riiqxText-muted">MOCK FEED LOADING STATE:</span>
                  <Badge variant="cyan" dot>SCANNING</Badge>
                </div>

                <SkeletonLoader variant="rectangular" className="h-16" />
                <div className="grid grid-cols-2 gap-3">
                  <SkeletonLoader variant="text" count={2} />
                  <SkeletonLoader variant="text" count={2} />
                </div>
                <SkeletonLoader variant="card" className="h-28" />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* GLASS DRAWER (INTERACTIVE MODAL / CART) */}
      <GlassDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="RIIQX BAG // CHECKOUT"
        subtitle="BATCH 004 DISPATCH RESERVATION"
        footer={
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-riiqxText-muted">TOTAL RESERVATION:</span>
              <span className="text-accent-crimson font-bold text-sm">$480.00 USD</span>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => {
                alert('RESERVATION CONFIRMED // CONTAINER HASH GENERATED.');
                setIsDrawerOpen(false);
              }}
            >
              INITIALIZE SECURE CHECKOUT
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-4 rounded-sm bg-charcoal-matte border border-glass-border-subtle flex items-center justify-between">
            <div>
              <Heading size="sm" font="sans">
                BATCH 004 // TACTICAL FLEECE
              </Heading>
              <span className="font-mono text-xs text-riiqxText-muted block mt-0.5">
                SIZE: L | COLOR: OBSIDIAN BLACK
              </span>
              <span className="font-mono text-xs text-accent-cyan mt-1 block">500 GSM ORGANIC COTTON</span>
            </div>
            <span className="font-mono font-bold text-accent-crimson text-sm">$480.00</span>
          </div>

          <div className="p-4 rounded-sm bg-accent-crimson/10 border border-accent-crimson/30 space-y-2">
            <span className="font-mono text-xs text-accent-crimson font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> SECURE DISPATCH PROTOCOL
            </span>
            <Text size="xs" variant="secondary">
              Includes anodized aluminium NFC serial tag and hermetically sealed carbon package.
            </Text>
          </div>
        </div>
      </GlassDrawer>
    </div>
  );
}
