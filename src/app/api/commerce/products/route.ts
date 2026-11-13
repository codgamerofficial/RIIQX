import { NextRequest, NextResponse } from 'next/server';
import { getHeritageProducts, INITIAL_HERITAGE_CATALOG } from '@/lib/riiqx/commerce/catalog-engine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const collection = searchParams.get('collection');
    const search = searchParams.get('q')?.toLowerCase();

    let products = getHeritageProducts(collection || undefined);

    if (search && search.trim()) {
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.tags.some((t) => t.toLowerCase().includes(search)) ||
          p.materials.some((m) => m.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      collections: ['All', 'RIIQX Objects', 'RIIQX Living', 'RIIQX Carry', 'RIIQX Everyday'],
      products,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to query catalog';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

