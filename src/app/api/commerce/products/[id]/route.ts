import { NextRequest, NextResponse } from 'next/server';
import { getHeritageProductById } from '@/lib/riiqx/commerce/catalog-engine';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = getHeritageProductById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve product';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

