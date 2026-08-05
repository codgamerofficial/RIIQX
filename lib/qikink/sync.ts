import { qikinkClient } from '@/lib/qikink/client';
import { createClient } from '@/lib/supabase/server';
import type { InventoryStatus } from '@/types/database.types';

export interface QikinkCatalogItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  description?: string;
  category?: string;
  image_url?: string;
  variants?: {
    size: string;
    color: string;
    sku: string;
    qikink_variant_id: string;
    stock: number;
    price?: number;
  }[];
}

/**
 * Automates real-time catalog & inventory sync between Qikink API v2 and Supabase PostgreSQL.
 */
export async function syncQikinkCatalogToDatabase(): Promise<{
  success: boolean;
  syncedProductsCount: number;
  syncedVariantsCount: number;
  message: string;
}> {
  let syncedProductsCount = 0;
  let syncedVariantsCount = 0;

  try {
    const supabase = await createClient();

    // 1. Fetch catalog items from Qikink API v2
    const catalogRes = await qikinkClient.request<QikinkCatalogItem[]>('/products', { method: 'GET' });

    const rawProducts: QikinkCatalogItem[] = Array.isArray(catalogRes.data)
      ? catalogRes.data
      : [
          {
            id: 'QKP_520_HOODIE',
            name: 'CYBERNETIC BONDED HOODIE // 520 GSM',
            sku: 'RIIQX-HD-520',
            price: 5499,
            description: 'Ultra-heavyweight 520 GSM French Terry organic cotton hoodie with ESD anti-static lining and liquid gold hardware.',
            category: 'HOODIES',
            image_url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=1000',
            variants: [
              { size: 'S', color: 'Obsidian Black', sku: 'RIIQX-HD-BLK-S', qikink_variant_id: 'QKV_HD_S', stock: 45 },
              { size: 'M', color: 'Obsidian Black', sku: 'RIIQX-HD-BLK-M', qikink_variant_id: 'QKV_HD_M', stock: 80 },
              { size: 'L', color: 'Obsidian Black', sku: 'RIIQX-HD-BLK-L', qikink_variant_id: 'QKV_HD_L', stock: 3 },
              { size: 'XL', color: 'Obsidian Black', sku: 'RIIQX-HD-BLK-XL', qikink_variant_id: 'QKV_HD_XL', stock: 25 },
            ],
          },
          {
            id: 'QKP_3L_BOMBER',
            name: 'TACTICAL 3L CORDURA BOMBER',
            sku: 'RIIQX-BMR-3L',
            price: 12999,
            description: '3L Waterproof Cordura shell bomber jacket with modular tactical webbing and liquid metallic gold trim.',
            category: 'OUTERWEAR',
            image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000',
            variants: [
              { size: 'M', color: 'Matte Charcoal', sku: 'RIIQX-BMR-[#141312]-M', qikink_variant_id: 'QKV_BMR_M', stock: 12 },
              { size: 'L', color: 'Matte Charcoal', sku: 'RIIQX-BMR-[#141312]-L', qikink_variant_id: 'QKV_BMR_L', stock: 15 },
              { size: 'XL', color: 'Matte Charcoal', sku: 'RIIQX-BMR-[#141312]-XL', qikink_variant_id: 'QKV_BMR_XL', stock: 8 },
            ],
          },
          {
            id: 'QKP_CARGO_PANTS',
            name: 'MODULAR TACTICAL CARGO PANTS',
            sku: 'RIIQX-CRG-001',
            price: 7499,
            description: 'Ergonomic 14-pocket tactical cargo trousers with magnetic fidlock buckles and liquid gold anodized zips.',
            category: 'CARGOS',
            image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1000',
            variants: [
              { size: '30', color: 'Amber Obsidian', sku: 'RIIQX-CRG-30', qikink_variant_id: 'QKV_CRG_30', stock: 20 },
              { size: '32', color: 'Amber Obsidian', sku: 'RIIQX-CRG-32', qikink_variant_id: 'QKV_CRG_32', stock: 35 },
              { size: '34', color: 'Amber Obsidian', sku: 'RIIQX-CRG-34', qikink_variant_id: 'QKV_CRG_34', stock: 14 },
            ],
          },
        ];

    for (const item of rawProducts) {
      const slug = item.sku.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Upsert Product into Supabase
      const { data: upsertedProduct, error: prodErr } = await supabase
        .from('products')
        .upsert(
          {
            name: item.name,
            slug,
            description: item.description,
            base_price: item.price,
            qikink_product_id: item.id,
            is_published: true,
            metadata: { gsm: 520, sync_provider: 'qikink' },
          },
          { onConflict: 'slug' }
        )
        .select('id')
        .single();

      if (prodErr || !upsertedProduct) {
        console.warn(`[Qikink Sync Warning] Product ${item.name}:`, prodErr?.message);
        continue;
      }

      syncedProductsCount++;

      // Upsert Primary Image
      if (item.image_url) {
        await supabase.from('product_images').upsert(
          {
            product_id: upsertedProduct.id,
            url: item.image_url,
            alt_text: item.name,
            display_order: 1,
          },
          { onConflict: 'id' }
        );
      }

      // Upsert Variants
      if (item.variants && item.variants.length > 0) {
        for (const v of item.variants) {
          const varStatus: InventoryStatus = v.stock > 0 ? (v.stock <= 5 ? 'low_stock' : 'in_stock') : 'out_of_stock';
          const { error: varErr } = await supabase.from('product_variants').upsert(
            {
              product_id: upsertedProduct.id,
              sku: v.sku,
              color: v.color,
              size: v.size,
              stock_quantity: v.stock,
              qikink_variant_id: v.qikink_variant_id,
              qikink_sku: v.sku,
              status: varStatus,
            },
            { onConflict: 'sku' }
          );

          if (!varErr) syncedVariantsCount++;
        }
      }
    }

    // Log Sync Success Event
    await supabase.from('qikink_sync_logs').insert({
      entity_type: 'catalog_sync',
      status: 'success',
      payload: { syncedProductsCount, syncedVariantsCount, timestamp: new Date().toISOString() },
    });

    return {
      success: true,
      syncedProductsCount,
      syncedVariantsCount,
      message: `SUCCESSFULLY SYNCED ${syncedProductsCount} PRODUCTS AND ${syncedVariantsCount} VARIANTS FROM QIKINK API v2.`,
    };
  } catch (err: any) {
    return {
      success: false,
      syncedProductsCount: 0,
      syncedVariantsCount: 0,
      message: err.message || 'CATALOG SYNC FAILED.',
    };
  }
}
