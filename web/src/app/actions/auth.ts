'use server'

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function signIn(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { message: error.message };
    }

    redirect('/account');
}

export async function signUp(prevState: any, formData: FormData) {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const referralCode = formData.get('referralCode') as string; // Invitation code

    const supabase = await createClient();
    const origin = (await headers()).get('origin');

    // Generate a simple random referral code for the new user
    const userReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
                full_name: `${firstName} ${lastName}`,
                first_name: firstName,
                last_name: lastName,
                referral_code: userReferralCode, // Their new code
                invited_by: referralCode || null, // The code they used
            },
        },
    });

    if (error) {
        return { message: error.message };
    }

    return { message: 'Account created! Please check your email to verify.' };
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}
