"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function unlockAchievement(achievementName: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    // 1. Get the achievement ID
    const { data: achievement, error: achError } = await supabase
        .from('achievements')
        .select('id, xp_reward')
        .eq('name', achievementName)
        .single();

    if (achError || !achievement) return { error: "Achievement not found" };

    // 2. Check if already unlocked
    const { data: existing } = await supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', user.id)
        .eq('achievement_id', achievement.id)
        .single();

    if (existing) return { message: "Already unlocked" };

    // 3. Unlock it
    const { error: insertError } = await supabase
        .from('user_achievements')
        .insert({
            user_id: user.id,
            achievement_id: achievement.id
        });

    if (insertError) return { error: "Failed to unlock" };

    // 4. Award XP
    await awardXP(user.id, achievement.xp_reward);

    revalidatePath('/');
    return { success: true, message: `Unlocked: ${achievementName}` };
}

export async function awardXP(userId: string, amount: number) {
    const supabase = await createClient();

    // Get current profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', userId)
        .single();

    if (!profile) return;

    const newXp = (profile.xp || 0) + amount;
    let newLevel = profile.level;

    // Simple leveling logic: Level = 1 + floor(XP / 1000)
    const calculatedLevel = 1 + Math.floor(newXp / 1000);

    if (calculatedLevel > newLevel) {
        newLevel = calculatedLevel;
    }

    await supabase
        .from('profiles')
        .update({ xp: newXp, level: newLevel })
        .eq('id', userId);
}
