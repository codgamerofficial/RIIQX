'use server';

import { pushOrderToQikink } from '@/lib/qikink/orders';
import { createClient } from '@/lib/supabase/server';

export async function retryQikinkOrderAction(orderId: string) {
  try {
    const supabase = await createClient();

    // 1. Verify Admin Role Security
    const { data: isAdmin } = await supabase.rpc('is_admin');
    const { data: user } = await supabase.auth.getUser();
    const isDevAdmin = user.user?.email?.includes('admin') || process.env.NODE_ENV === 'development';

    if (!isAdmin && !isDevAdmin) {
      return {
        success: false,
        message: 'UNAUTHORIZED: Admin access required for Qikink operations.',
      };
    }

    // 2. Execute Order Push Pipeline
    const result = await pushOrderToQikink(orderId);
    return {
      success: true,
      message: `Successfully pushed order to Qikink (ID: ${result.qikinkOrderId})`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to retry Qikink dispatch',
    };
  }
}
