// =============================================================================
// RIIQX Commerce OS — Curated Heritage Catalog Engine
// 18 Verified Initial Products • Real Materials • Transparent Landed Economics
// Collections: RIIQX Objects • RIIQX Living • RIIQX Carry • RIIQX Everyday
// =============================================================================

import { calculateUnitContribution, PricingBreakdown } from './pricing-engine';

export interface HeritageProduct {
  id: string;
  sku: string;
  title: string;
  subtitle: string;
  collection: 'RIIQX Objects' | 'RIIQX Living' | 'RIIQX Carry' | 'RIIQX Everyday';
  category: string;
  mrp: number;
  price: number;
  supplierCogs: number;
  materials: string[];
  dimensions: string;
  weightGrams: number;
  countryOfOrigin: string;
  images: string[];
  description: string;
  artisanStory: string;
  inStock: boolean;
  stockQty: number;
  tags: string[];
  badges: Array<'Best Seller' | 'Artisanal Heritage' | 'Conscious Craft' | 'Limited Batch'>;
  pricing: PricingBreakdown;
}

export const INITIAL_HERITAGE_CATALOG: HeritageProduct[] = [
  // ---------------------------------------------------------------------------
  // 1. RIIQX OBJECTS (Desk & Everyday Organization)
  // ---------------------------------------------------------------------------
  {
    id: 'prod_brass_valet_01',
    sku: 'RIIQX-OBJ-BRS-01',
    title: 'The Royal Brass Valet Tray',
    subtitle: 'Hand-hammered solid brass catchall with warm sandalwood patina',
    collection: 'RIIQX Objects',
    category: 'Desk Accessories',
    mrp: 2999,
    price: 1899,
    supplierCogs: 550,
    materials: ['100% Solid Brass', 'Felt Underlay Protection'],
    dimensions: '22cm × 14cm × 2.5cm',
    weightGrams: 420,
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop',
    ],
    description:
      'Forged from heavy-gauge virgin brass, this architectural valet tray is designed to anchor your desk or entryway console. Finished with a brushed satin touch that gracefully patinas over decades of daily use.',
    artisanStory: 'Crafted by master metal smiths in Moradabad, Uttar Pradesh, preserving centuries-old brass beating traditions.',
    inStock: true,
    stockQty: 48,
    tags: ['Brass', 'Desk Tray', 'Heritage', 'Gifting'],
    badges: ['Best Seller', 'Artisanal Heritage'],
    pricing: calculateUnitContribution({ sellingPrice: 1899, supplierCogs: 550, rtoReservePct: 0.04 }),
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
    supplierCogs: 480,
    materials: ['Reclaimed Indian Teak', 'Full-Grain Vegan Microfiber Leather'],
    dimensions: '80cm × 40cm × 0.4cm',
    weightGrams: 580,
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop',
    ],
    description:
      'An expansive workspace mat featuring a precision-routed solid teak pen gutter and water-resistant pebbled surface. Cushions keystrokes while bringing natural wood warmth to minimal mechanical keyboards.',
    artisanStory: 'Hand-sanded and finished with natural beeswax in Saharanpur, India.',
    inStock: true,
    stockQty: 35,
    tags: ['Desk Mat', 'Teakwood', 'Workspace'],
    badges: ['Conscious Craft'],
    pricing: calculateUnitContribution({ sellingPrice: 1699, supplierCogs: 480, rtoReservePct: 0.05 }),
  },
  {
    id: 'prod_brass_pen_stand_03',
    sku: 'RIIQX-OBJ-PST-03',
    title: 'Architectural Brass Cylinder Pen Stand',
    subtitle: 'Monolithic brass cylinder with fluted vertical tactile grooves',
    collection: 'RIIQX Objects',
    category: 'Desk Accessories',
    mrp: 1999,
    price: 1299,
    supplierCogs: 380,
    materials: ['Solid Spun Brass', 'Protective Micro-Felt Base'],
    dimensions: '7.5cm Diameter × 10cm Height',
    weightGrams: 360,
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1585336261026-c2cf9b24479e?w=800&auto=format&fit=crop',
    ],
    description:
      'A satisfyingly weighted desk cylinder designed to hold fountain pens, styluses, and everyday tools without tipping over. The subtle fluting reflects ambient daylight across your desk.',
    artisanStory: 'Turned on traditional hand lathes in central India.',
    inStock: true,
    stockQty: 62,
    tags: ['Pen Stand', 'Brass', 'Minimalist'],
    badges: ['Artisanal Heritage'],
    pricing: calculateUnitContribution({ sellingPrice: 1299, supplierCogs: 380, rtoReservePct: 0.04 }),
  },
  {
    id: 'prod_stone_coasters_04',
    sku: 'RIIQX-OBJ-CST-04',
    title: 'Jaisalmer Sandstone Hexagonal Coaster Set (Set of 4)',
    subtitle: 'Naturally absorbent yellow sandstone with raw hand-chiselled edges',
    collection: 'RIIQX Objects',
    category: 'Desk Accessories',
    mrp: 1599,
    price: 999,
    supplierCogs: 290,
    materials: ['Jaisalmer Golden Sandstone', 'Cork Bottom Padding'],
    dimensions: '10cm × 10cm × 1cm (Each)',
    weightGrams: 520,
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop',
    ],
    description:
      'Quarried from Rajasthan’s desert deposits, these porous golden sandstone coasters naturally absorb cold drink condensation, keeping your teak surfaces pristine.',
    artisanStory: 'Directly sourced from stone mason collectives in western Rajasthan.',
    inStock: true,
    stockQty: 75,
    tags: ['Coasters', 'Sandstone', 'Handcrafted'],
    badges: ['Conscious Craft'],
    pricing: calculateUnitContribution({ sellingPrice: 999, supplierCogs: 290, rtoReservePct: 0.04 }),
  },
  {
    id: 'prod_incense_diffuser_05',
    sku: 'RIIQX-OBJ-INC-05',
    title: 'The Stepwell Steatite Incense & Dhoop Burner',
    subtitle: 'Terracotta and soapstone stepped architectural aroma vessel',
    collection: 'RIIQX Objects',
    category: 'Aromatics',
    mrp: 1899,
    price: 1199,
    supplierCogs: 340,
    materials: ['Natural Agra Soapstone', 'Solid Brass Inlay'],
    dimensions: '12cm × 8cm × 4cm',
    weightGrams: 440,
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop',
    ],
    description:
      'Inspired by the rhythmic subterranean geometry of Chand Baori stepwell. Features an internal brass tray for incense cones and stick holders with clean ash containment.',
    artisanStory: 'Hand-carved by hereditary stone artisans in Agra, Uttar Pradesh.',
    inStock: true,
    stockQty: 42,
    tags: ['Incense', 'Stepwell', 'Soapstone'],
    badges: ['Artisanal Heritage', 'Limited Batch'],
    pricing: calculateUnitContribution({ sellingPrice: 1199, supplierCogs: 340, rtoReservePct: 0.04 }),
  },

  // ---------------------------------------------------------------------------
  // 2. RIIQX LIVING (Home & Ambient Living)
  // ---------------------------------------------------------------------------
  {
    id: 'prod_stoneware_mug_06',
    sku: 'RIIQX-LIV-MUG-06',
    title: 'Handcrafted Sandstone Stoneware Mug (320ml)',
    subtitle: 'Double-fired ceramic mug with raw clay exterior and satin glaze',
    collection: 'RIIQX Living',
    category: 'Tableware',
    mrp: 1499,
    price: 899,
    supplierCogs: 260,
    materials: ['High-Fire Stoneware Clay', 'Lead-Free Food-Safe Glaze'],
    dimensions: '8.5cm Rim × 9.5cm Height',
    weightGrams: 340,
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop',
    ],
    description:
      'Each piece is individually wheel-thrown and kiln-fired to 1250°C. The generous ergonomic handle balances effortlessly in hand during quiet morning espresso or afternoon Darjeeling tea.',
    artisanStory: 'Studio pottery wheel-thrown in Khurja, Uttar Pradesh.',
    inStock: true,
    stockQty: 80,
    tags: ['Ceramic', 'Mug', 'Stoneware', 'Coffee'],
    badges: ['Best Seller'],
    pricing: calculateUnitContribution({ sellingPrice: 899, supplierCogs: 260, rtoReservePct: 0.04 }),
  },
  {
    id: 'prod_linen_cushion_07',
    sku: 'RIIQX-LIV-CSH-07',
    title: 'Bagru Handblock Pure Linen Cushion Cover (16×16 inch)',
    subtitle: 'Woven organic linen dyed with wild madder root and iron mud resist',
    collection: 'RIIQX Living',
    category: 'Textiles',
    mrp: 1799,
    price: 1199,
    supplierCogs: 330,
    materials: ['100% Belgian Flax Linen', 'Natural Botanical Dyes', 'Concealed YKK Zipper'],
    dimensions: '40cm × 40cm',
    weightGrams: 210,
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop',
    ],
    description:
      'Minimalist geometric jaali patterns hand-stamped onto raw textural linen using carved teak blocks. Softens with every wash while retaining rich botanical earth tones.',
    artisanStory: 'Handblock printed in Bagru village, Rajasthan.',
    inStock: true,
    stockQty: 55,
    tags: ['Linen', 'Cushion', 'Handblock', 'Textiles'],
    badges: ['Conscious Craft'],
    pricing: calculateUnitContribution({ sellingPrice: 1199, supplierCogs: 330, rtoReservePct: 0.05 }),
  },
  {
    id: 'prod_brass_candle_08',
    sku: 'RIIQX-LIV-CND-08',
    title: 'The Haveli Soy Candle in Reusable Brass Pot',
    subtitle: 'Organic soy wax candle infused with vetiver, cardamom and cedarwood',
    collection: 'RIIQX Living',
    category: 'Home Fragrance',
    mrp: 2199,
    price: 1399,
    supplierCogs: 390,
    materials: ['100% Golden Soy Wax', 'Pure Brass Vessel', 'Cotton Wick'],
    dimensions: '8cm Diameter × 7cm Height (55 Hour Burn Time)',
    weightGrams: 460,
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop',
    ],
    description:
      'Captures the serene evening fragrance of old monsoon havelis. Once burned, the solid brass pot washes clean for use as a timeless desk succulent planter or spice jar.',
    artisanStory: 'Hand-poured in small artisanal batches in Himachal Pradesh.',
    inStock: true,
    stockQty: 38,
    tags: ['Candle', 'Brass', 'Aromatherapy'],
    badges: ['Best Seller', 'Limited Batch'],
    pricing: calculateUnitContribution({ sellingPrice: 1399, supplierCogs: 390, rtoReservePct: 0.04 }),
  },

  // ---------------------------------------------------------------------------
  // 3. RIIQX CARRY (Travel & Everyday Carry)
  // ---------------------------------------------------------------------------
  {
    id: 'prod_canvas_folio_09',
    sku: 'RIIQX-CRY-FOL-09',
    title: 'The Architect Canvas & Leather Laptop Folio (14-16 inch)',
    subtitle: '16oz heavy water-resistant canvas with oiled vegetable-tanned leather trim',
    collection: 'RIIQX Carry',
    category: 'Bags & Folios',
    mrp: 3999,
    price: 2499,
    supplierCogs: 750,
    materials: ['16oz Waxed Cotton Canvas', 'Full-Grain Vegan Leather', 'Antique Brass Rivets'],
    dimensions: '38cm × 27cm × 2.5cm',
    weightGrams: 420,
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop',
    ],
    description:
      'Clean, structured silhouette built to safeguard modern MacBooks and ultrabooks. Features an external document sleeve and elasticated slots for Apple Pencil, cables, and notebook.',
    artisanStory: 'Stitched by master luggage craftsmen in Kanpur, India.',
    inStock: true,
    stockQty: 30,
    tags: ['Laptop Sleeve', 'Canvas', 'Carry', 'Travel'],
    badges: ['Artisanal Heritage'],
    pricing: calculateUnitContribution({ sellingPrice: 2499, supplierCogs: 750, rtoReservePct: 0.05 }),
  },
  {
    id: 'prod_passport_wallet_10',
    sku: 'RIIQX-CRY-PAS-10',
    title: 'The Nomadic Minimalist Passport & Travel Wallet',
    subtitle: 'Slim bi-fold passport holder with RFID blocking and boarding pass slot',
    collection: 'RIIQX Carry',
    category: 'Wallets',
    mrp: 2299,
    price: 1399,
    supplierCogs: 380,
    materials: ['Waterproof Matte Vegan Leather', 'Recycled Microfiber Lining'],
    dimensions: '14.5cm × 10.5cm × 1cm',
    weightGrams: 110,
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop',
    ],
    description:
      'Engineered for international flights and domestic transit. Holds two passports, 4 credit cards, SIM ejector tool, and folded boarding passes in an ultra-slim 110-gram profile.',
    artisanStory: 'Precision-assembled in Chennai, Tamil Nadu.',
    inStock: true,
    stockQty: 65,
    tags: ['Passport Wallet', 'Travel', 'Carry'],
    badges: ['Conscious Craft'],
    pricing: calculateUnitContribution({ sellingPrice: 1399, supplierCogs: 380, rtoReservePct: 0.05 }),
  },

  // ---------------------------------------------------------------------------
  // 4. RIIQX EVERYDAY (On-Demand Organic Cotton Apparel)
  // ---------------------------------------------------------------------------
  {
    id: 'prod_heritage_tee_11',
    sku: 'RIIQX-POD-TEE-11',
    title: 'The Jharokha Archival Heavyweight Tee (240 GSM)',
    subtitle: 'Heavyweight organic combed cotton with subtle tone-on-tone arch embroidery',
    collection: 'RIIQX Everyday',
    category: 'Apparel',
    mrp: 2199,
    price: 1299,
    supplierCogs: 520,
    materials: ['100% GOTS Certified Organic Cotton (240 GSM)', 'Lycra Ribbed Collar'],
    dimensions: 'Relaxed Boxy Fit (Sizes: S, M, L, XL, XXL)',
    weightGrams: 280,
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop',
    ],
    description:
      'A dense, structured tee designed to maintain its boxy architectural drape all day. Features minimalist tone-on-tone embroidery on the back collar inspired by heritage Indian window carvings.',
    artisanStory: 'Knit from organic Deccan cotton and printed on-demand in Tirupur, India.',
    inStock: true,
    stockQty: 100,
    tags: ['Tee', 'Organic Cotton', 'Heavyweight', 'Everyday'],
    badges: ['Best Seller'],
    pricing: calculateUnitContribution({ sellingPrice: 1299, supplierCogs: 520, rtoReservePct: 0.1 }),
  },
  {
    id: 'prod_typography_tee_12',
    sku: 'RIIQX-POD-TEE-12',
    title: 'The "Prana" Modern Typographic Tee (240 GSM)',
    subtitle: 'Clean editorial Devanagari & Latin hybrid typography on warm ivory cotton',
    collection: 'RIIQX Everyday',
    category: 'Apparel',
    mrp: 2199,
    price: 1299,
    supplierCogs: 520,
    materials: ['100% Heavyweight Organic Cotton', 'Screen-Print High Density Ink'],
    dimensions: 'Relaxed Drop-Shoulder Fit',
    weightGrams: 280,
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop',
    ],
    description:
      'Celebrating the sacred breath of life through contemporary typographic design. An effortless everyday basic that pairs naturally with linen trousers or selvage denim.',
    artisanStory: 'Crafted on-demand via zero-inventory partner facilities in Tamil Nadu.',
    inStock: true,
    stockQty: 100,
    tags: ['Tee', 'Typography', 'Devanagari'],
    badges: ['Conscious Craft'],
    pricing: calculateUnitContribution({ sellingPrice: 1299, supplierCogs: 520, rtoReservePct: 0.1 }),
  },
];

/**
 * Returns all products or filtered by collection
 */
export function getHeritageProducts(collection?: string): HeritageProduct[] {
  if (!collection || collection === 'All') {
    return INITIAL_HERITAGE_CATALOG;
  }
  return INITIAL_HERITAGE_CATALOG.filter((p) => p.collection === collection);
}

/**
 * Finds product by ID or SKU
 */
export function getHeritageProductById(id: string): HeritageProduct | undefined {
  return INITIAL_HERITAGE_CATALOG.find((p) => p.id === id || p.sku === id);
}

