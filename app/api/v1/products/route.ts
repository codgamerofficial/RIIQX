import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MOCK_PRODUCTS } from '@/lib/db/homepage';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let filtered = MOCK_PRODUCTS;

    if (category && category !== 'all') {
      filtered = MOCK_PRODUCTS.filter(
        (p) => p.category?.slug === category || p.category?.name.toLowerCase() === category.toLowerCase()
      );
    }

    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json(
      {
        success: true,
        data: paginated,
        pagination: {
          total: filtered.length,
          limit,
          offset,
        },
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: (error as Error).message || 'Failed to fetch catalog products.',
          details: null,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
