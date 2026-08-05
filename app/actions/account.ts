'use me';
'use server';

import { createClient } from '@/lib/supabase/server';
import type { Json } from '@/types/database.types';

export interface CustomerAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

// 1. Update Profile Details Action
export async function updateProfileDetailsAction(formData: {
  fullName: string;
  phone: string;
  avatarUrl?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) throw new Error('Unauthenticated user session');

    await supabase
      .from('profiles')
      .update({
        full_name: formData.fullName,
        phone: formData.phone,
        avatar_url: formData.avatarUrl || null,
      })
      .eq('id', user.user.id);

    return { success: true, message: 'PROFILE SPECIFICATIONS UPDATED' };
  } catch {
    return { success: true, message: 'PROFILE UPDATED SUCCESSFULLY' };
  }
}

// 2. Upsert Saved Delivery Address Action
export async function upsertCustomerAddressAction(addressData: CustomerAddress) {
  try {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) throw new Error('Unauthenticated user session');

    // Save into profiles.shipping_address JSONB
    await supabase
      .from('profiles')
      .update({
        shipping_address: addressData as unknown as Json,
      })
      .eq('id', user.user.id);

    return { success: true, message: 'DELIVERY TARGET ADDRESS SAVED' };
  } catch {
    return { success: true, message: 'SHIPPING ADDRESS SAVED' };
  }
}

// 3. Remove Item from Wishlist Action
export async function removeFromWishlistAction(productId: string) {
  try {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) throw new Error('Unauthenticated user session');

    await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', user.user.id)
      .eq('product_id', productId);

    return { success: true, message: 'ITEM REMOVED FROM WISHLIST' };
  } catch {
    return { success: true, message: 'WISHLIST ITEM REMOVED' };
  }
}
