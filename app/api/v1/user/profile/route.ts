import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: user, error: authError } = await supabase.auth.getUser();

    if (authError || !user.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired JWT session token.',
            details: null,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        id: user.user.id,
        email: user.user.email,
        fullName: profile?.full_name || 'Saswat Patra',
        role: profile?.role || 'customer',
        shippingAddress: profile?.shipping_address || null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: (error as Error).message,
          details: null,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: user, error: authError } = await supabase.auth.getUser();

    if (authError || !user.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired JWT session token.',
            details: null,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fullName, phone } = body;

    await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone,
      })
      .eq('id', user.user.id);

    return NextResponse.json({
      success: true,
      message: 'USER PROFILE UPDATED',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: (error as Error).message,
          details: null,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
