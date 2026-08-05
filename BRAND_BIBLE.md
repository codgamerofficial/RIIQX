# RIIQX — Official Brand Bible & Design Token System
**Version 1.0.0** | **Classification:** Master Brand Document & Design System Standard
**Target Platforms:** Web (Next.js), Mobile (React Native Expo), Desktop (Electron/Tauri)

---

## EXECUTIVE SUMMARY

**RIIQX** (pronounced `/riːks/` / *REE-KS*) is a hyper-premium, futuristic dark-mode streetwear label operating at the precise intersection of high fashion, cybernetic minimalism, and tech aesthetics.

Built for a discerning demographic that values luxury craftsmanship, monolithic silhouettes, high-performance textiles, and subtle micro-interactions, RIIQX rejects traditional retail paradigms in favor of limited batch drops, technical specifications, and raw digital elegance.

---

# PART 1: STRATEGIC BRAND IDENTITY

## 1. Brand Mission & Vision Statement

### Brand Positioning Statement
> *For the architects of the post-human digital age, RIIQX is the supreme luxury technical apparel label that engineers high-performance cybernetic streetwear. Unlike mass-market techwear or legacy luxury fashion, RIIQX merges monolithic dark aesthetics, laboratory-grade materials, and subtle micro-interactions into an uncompromised dark-mode experience.*

### Mission Statement
To construct high-grade garments, digital-physical artifacts, and immersive web interfaces for those who navigate the shadow spaces between luxury craftsmanship and raw digital performance. RIIQX fuses tactile materials with hyper-precise micro-details, bringing dystopian elegance into physical and virtual reality.

### Vision Statement
To define the definitive architectural aesthetic of post-human apparel, standing as the global authority in cyber-noir luxury, monolithic minimalism, and tech-augmented design systems.

---

## 2. Brand Voice & Tone Guidelines

### Brand Archetype: The Cybernetic Monolith / Digital Avant-Garde
The voice of RIIQX is cold, precise, cryptic, authoritative, and ultra-luxurious. It communicates like a high-security defense contractor or an advanced artificial intelligence announcing a system update.

### Voice Attributes
1. **Calculated Precision:** Zero marketing fluff or emotional pleading. Sentences are stripped of hyperbolic adjectives. Every word carries structural weight.
2. **Cryptic Authority:** Releases are referred to as *Deployments*, *System Cycles*, or *Batches*. Quantities are strict and technical.
3. **Tactile Monolithism:** Focus on physical material properties—GSM weight, weave density, laser-etched titanium hardware, anti-static carbon filaments.

### Communication Guidelines by Channel

| Channel | Tone & Format | Sample Copy |
| :--- | :--- | :--- |
| **Marketing & Editorial** | High-impact, uppercase, technical specifications presented like architectural schematics. | `SYSTEM DEPLOYMENT // BATCH 004. 500 GSM HEAVYWEIGHT TACTICAL FLEECE. LIMITED TO 150 UNITS WORLDWIDE.` |
| **UI Microcopy** | Minimal, directional, machine-interface inspired. Monospaced cues. | `[ INITIALIZE CHECKOUT ]` <br> `AUTHENTICATING GARMENT ID...` <br> `STOCK DEPLETED // ACCESS DENIED` |
| **Transactional Emails** | Encrypted-aesthetic order summaries with status codes and container hashes. | `STATUS: ORDER CONFIRMED` <br> `DISPATCH SLOT: 08.06.2026 // 0400 UTC` <br> `CONTAINER HASH: 0x8F9A2C...` |

### Dos & Don'ts for Luxury Cyber Tone

#### DO
- **DO** use precise technical metrics (e.g., *500 GSM*, *Bonded Membrane*, *Hydrophobic Coating*, *Laser-Engraved Anodized Hardware*).
- **DO** present microcopy in uppercase display typography or lowercase monospaced code styling.
- **DO** frame product drops as software/hardware system releases (`DEPLOYMENT_01`, `PATCH_v2.4`).
- **DO** maintain strict dark-mode aesthetics across all touchpoints.

#### DON'T
- **DON'T** use generic retail clichés (e.g., *"Hurry, sales end soon!"*, *"Must-have item!"*, *"Super soft and cozy!"*).
- **DON'T** use casual emojis (e.g., 🔥, 😱, 🎉, 😊). Use strictly geometric unicode symbols (`//`, `[ ▲ ]`, `::`, `01`).
- **DON'T** offer mass discounts or cheesy promotional banners.
- **DON'T** over-explain or sound eager to sell. Scarcity and mystery are absolute.

---

## 3. Aesthetics & Visual Directions

### Photography & Imagery Direction

```
                  ┌─────────────────────────────────────────┐
                  │    STUDIO & CYBER-NOIR PHOTOGRAPHY      │
                  └────────────────────┬────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
│ LIGHTING        │           │ SUBJECT POSING  │           │ HARDWARE FOCUS  │
│ High-contrast   │           │ Monolithic &    │           │ Micro macro     │
│ Chiaroscuro &   │           │ Reserved        │           │ Close-ups on    │
│ Neon Rim Edge   │           │ Silhouettes     │           │ Laser Engravings│
└─────────────────┘           └─────────────────┘           └─────────────────┘
```

* **Lighting:** Low-key cyber-noir lighting, deep chiaroscuro shadows, high-contrast studio rim lights with subtle neon edge refractions (Electric Crimson, Holographic Cyan, or Voltage Purple).
* **Models & Posing:** Monolithic, relaxed yet dominant postures. Faces partially shielded by shadows or technical hoods, emphasizing garment geometry, line work, and silhouette over model persona.
* **Environments:** Brutalist raw concrete architectures, wet obsidian streets reflecting neon lights, clean sterile darkrooms, and high-tech research labs.
* **Macro Product Framing:** Extreme close-ups on custom matte-black hardware, heat-sealed rubber badges, seam tape, technical zippers, and QR-engravings.

### Packaging & Unboxing Concept

1. **Outer Vessel:** Matte black ultra-dense rigid board box with stealth debossed logo (`RIIQX` in matte gloss varnish over a matte black substrate).
2. **Inner Shield:** Hermetically-sealed anti-static carbon foil bags with tamper-evident security seal labels bearing batch hashes.
3. **Garment Tag System:** Laser-engraved anodized aluminium tag attached via a steel braided cable, bearing the unit batch serial number and an integrated NFC chip linking to a blockchain digital certificate of authenticity.
4. **Documentation:** Monochromatic spec-sheet insert printed on 300 GSM matte stock with silver foil stamping detailing garment care and engineering parameters.

---

# PART 2: DESIGN TOKEN SYSTEM (DARK MODE / FUTURISTIC)

## 1. Color System Matrix

### Base & Surface Palette

| Token Name | HEX | OKLCH Code | Purpose / Usage |
| :--- | :--- | :--- | :--- |
| `obsidian-base` | `#050508` | `oklch(0.12 0.01 270)` | Main application background canvas. Deep pitch black with indigo tint. |
| `obsidian-void` | `#090A0F` | `oklch(0.14 0.015 270)` | Secondary background & modal backdrop underlay. |
| `charcoal-matte` | `#12131C` | `oklch(0.18 0.02 270)` | Structural cards, container surfaces, and navigation bars. |
| `charcoal-elevated` | `#181926` | `oklch(0.21 0.02 270)` | Elevated cards, dropdown menus, and popover panels. |
| `surface-hover` | `#1E2030` | `oklch(0.24 0.025 270)` | Hover state for interactive card layers. |

### Glassmorphism & Layers

| Token Name | RGBA / CSS Value | Backdrop Blur | Border Color |
| :--- | :--- | :--- | :--- |
| `glass-surface-base` | `rgba(18, 19, 28, 0.65)` | `24px (medium)` | `rgba(255, 255, 255, 0.07)` |
| `glass-surface-elevated` | `rgba(28, 30, 44, 0.50)` | `40px (heavy)` | `rgba(255, 255, 255, 0.14)` |
| `glass-border-subtle` | `rgba(255, 255, 255, 0.07)` | — | Default structural grid divider. |
| `glass-border-medium` | `rgba(255, 255, 255, 0.14)` | — | Card hover & focused element border. |
| `glass-border-active` | `rgba(255, 255, 255, 0.28)` | — | Selected item highlight border. |
| `glass-border-accent` | `rgba(255, 0, 60, 0.50)` | — | Active laser focus accent border. |

### Accent Highlights

| Accent Name | HEX | OKLCH Code | Glow Effect (Box Shadow) | Application |
| :--- | :--- | :--- | :--- | :--- |
| **Electric Crimson** | `#FF003C` | `oklch(0.60 0.28 20)` | `0 0 25px rgba(255,0,60,0.40)` | Primary Action, Laser focal points, Brand Mark |
| **Holographic Cyan** | `#00F0FF` | `oklch(0.82 0.19 200)` | `0 0 25px rgba(0,240,255,0.40)` | Tech telemetry, Secondary highlights, NFC link |
| **Acid Lime** | `#CCFF00` | `oklch(0.91 0.26 125)` | `0 0 25px rgba(204,255,0,0.40)` | Limited Drop Badge, High-visibility alerts |
| **Voltage Purple** | `#7000FF` | `oklch(0.48 0.31 290)` | `0 0 30px rgba(112,0,255,0.40)` | Cyberpunk secondary accent, NFT/Web3 elements |

### Text & State Palette

| Token Name | HEX | Purpose |
| :--- | :--- | :--- |
| `text-primary` | `#FFFFFF` | High-contrast body text, primary headers |
| `text-secondary` | `#CBD5E1` | Secondary descriptions, specs, metadata |
| `text-muted` | `#64748B` | Dimmed technical labels, timestamps |
| `text-disabled` | `#334155` | Out-of-stock items, inactive state |
| `state-success` | `#00FF9D` | Operational status ok, stock available |
| `state-error` | `#FF024E` | Critical error, sold out, verification failed |
| `state-warning` | `#FFB800` | Low inventory alert, system warning |
| `state-info` | `#00F0FF` | Telemetry status, info popup |

---

## 2. Typography System & Scale

### Typography Stack
* **Display / Headline:** `Monument Extended` / `Syne` / `Orbitron` — Bold, wide, futuristic.
* **Body / Primary UI:** `Space Grotesk` / `Inter` / `SF Pro Display` — Modern, geometric, hyper-readable.
* **Technical Mono:** `JetBrains Mono` / `Space Mono` — Code snippets, specs, timestamps, coordinates.

### Type Scale Mapping (Mobile & Desktop)

| Level | Size (rem / px) | Line Height | Tracking (Letter Spacing) | Target Usage |
| :--- | :--- | :--- | :--- | :--- |
| `xs` | `0.75rem` (12px) | `1.0rem` (16px) | `+0.05em` | Metadata, System tags, Monospaced labels |
| `sm` | `0.875rem` (14px) | `1.25rem` (20px) | `+0.02em` | UI labels, Button copy, Form fields |
| `base` | `1.0rem` (16px) | `1.5rem` (24px) | `0.00em` | Primary body text, Garment descriptions |
| `lg` | `1.125rem` (18px) | `1.75rem` (28px) | `-0.01em` | Lead paragraphs, Card titles |
| `xl` | `1.25rem` (20px) | `1.75rem` (28px) | `-0.01em` | Subheaders, Section titles |
| `2xl` | `1.5rem` (24px) | `2.0rem` (32px) | `-0.02em` | H3 Headings, Modal Titles |
| `3xl` | `2.0rem` (32px) | `2.5rem` (40px) | `-0.03em` | H2 Headings, Product Names |
| `4xl` | `2.5rem` (40px) | `3.0rem` (48px) | `-0.04em` | H1 Headings (Mobile Hero) |
| `5xl` | `3.5rem` (56px) | `4.0rem` (64px) | `-0.04em` | Hero Titles (Desktop) |
| `6xl` | `4.5rem` (72px) | `4.75rem` (76px) | `-0.05em` | Display Banners & Monolithic Headers |

---

## 3. Spatial, Border Radius & Motion Tokens

### Border Radius Tokens
* `radius-none` (`0px`): Sharp technical cut edges for brutalist containers and buttons.
* `radius-sm` (`2px`): Micro-chamfers for subtle badges, tags, and small buttons.
* `radius-md` (`4px`): Standard cards, input fields, dropdown menus.
* `radius-lg` (`8px`): Floating overlays, dialog containers.
* `radius-xl` (`16px`): Hero section cards, outer modal viewports.
* `radius-full` (`9999px`): Circular toggles and status indicators.

### Motion Curves & Micro-Interactions

```
[Hover Event] ---> cubic-bezier(0.16, 1, 0.3, 1) ---> Instant High Friction Rebound
```

* **`ease-magnetic` (`cubic-bezier(0.16, 1, 0.3, 1)`):** Primary curve for cursor attraction, magnetic buttons, and card lifts.
* **`ease-cyber-out` (`cubic-bezier(0.0, 0.0, 0.2, 1)`):** Rapid reveal for dropdowns and popover menus.
* **`ease-cyber-in-out` (`cubic-bezier(0.7, 0, 0.84, 0)`):** Cybernetic drawer slides and full-screen modal overlays.
* **Durations:** `instant` (75ms), `fast` (150ms), `normal` (300ms), `slow` (500ms).

---

# PART 3: CODE EXPORTS & INTEGRATION GUIDE

The design token system is exported in two production-ready formats:

1. [`tokens.css`](file:///d:/RIIQX/tokens.css) — CSS Custom Properties (`:root`) for web and cross-platform CSS engines.
2. [`tailwind.config.ts`](file:///d:/RIIQX/tailwind.config.ts) — Extended Tailwind CSS configuration script (v3/v4 compatible) typed for Next.js and React environments.

### Usage in Web Applications (Next.js / React)

Import `tokens.css` in your global CSS entrypoint (`app/globals.css` or `pages/_app.tsx`):

```tsx
import '@/styles/tokens.css';
```

Apply Tailwind classes directly:

```tsx
export function ProductCard({ title, price, batchCode }: ProductProps) {
  return (
    <div className="riiqx-glass-panel p-6 border border-glass-border-subtle hover:border-accent-crimson transition-all duration-300 ease-magnetic">
      <span className="font-mono text-xs text-accent-cyan tracking-wider">{batchCode}</span>
      <h3 className="font-display text-2xl text-riiqxText-primary mt-2">{title}</h3>
      <p className="font-mono text-lg text-accent-crimson mt-4">{price}</p>
      <button className="w-full mt-6 riiqx-btn-primary">
        INITIALIZE PURCHASE
      </button>
    </div>
  );
}
```

---
*© 2026 RIIQX LABS. ALL RIGHTS RESERVED. CLASSIFIED BRAND SPECIFICATION.*
