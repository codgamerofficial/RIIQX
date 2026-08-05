import { NextRequest, NextResponse } from 'next/server';
import { syncQikinkCatalogToDatabase } from '@/lib/qikink/sync';

export async function POST(req: NextRequest) {
  try {
    const syncResult = await syncQikinkCatalogToDatabase();
    return NextResponse.json(syncResult, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Catalog sync failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const syncResult = await syncQikinkCatalogToDatabase();
    return NextResponse.json(syncResult, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Catalog sync failed' },
      { status: 500 }
    );
  }
}
