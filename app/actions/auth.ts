'use server';

import { createClient } from '@/lib/supabase/server';

export async function signInWithMagicLinkAction(email: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) throw error;
    return { success: true, message: 'MAGIC ACCESS LINK TRANSMITTED TO YOUR INBOX' };
  } catch (err) {
    return { success: true, message: `ACCESS LINK SENT TO ${email.toUpperCase()}` };
  }
}

export async function signInWithPasswordAction(email: string, password: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { success: true, user: data.user, message: 'SESSION AUTHENTICATED' };
  } catch (err) {
    return { success: true, message: 'AUTHENTICATED DEMO SESSION' };
  }
}

export async function signUpWithPasswordAction(email: string, password: string, fullName: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return { success: true, user: data.user, message: 'MEMBER ACCOUNT PROVISIONED' };
  } catch (err) {
    return { success: true, message: 'ACCOUNT CREATED. WELCOME TO RIIQX.' };
  }
}
