"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    xp_reward: number;
    unlocked_at?: string;
}

export interface ProfileData {
    xp: number;
    level: number;
    title: string;
}

export function useGamification() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<ProfileData>({ xp: 0, level: 1, title: "Initiate" });
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        // Get initial user
        const initUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                await fetchGamificationData(user.id);
            }
            setLoading(false);
        };
        initUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchGamificationData(session.user.id);
            } else {
                setProfile({ xp: 0, level: 1, title: "Initiate" });
                setAchievements([]);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Realtime subscription for Profile updates (XP/Level)
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel('gamification_updates')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`
                },
                (payload) => {
                    const newProfile = payload.new as ProfileData;
                    // Check for level up
                    if (newProfile.level > profile.level) {
                        toast.success(`LEVEL UP! You are now Level ${newProfile.level}`, {
                            description: `Title: ${newProfile.title}`,
                            duration: 5000,
                        });
                    }
                    setProfile({
                        xp: newProfile.xp,
                        level: newProfile.level,
                        title: newProfile.title
                    });
                }
            )
            .subscribe();

        // Listen for new achievements
        const achievementChannel = supabase
            .channel('achievement_unlocks')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'user_achievements',
                    filter: `user_id=eq.${user.id}`
                },
                async (payload) => {
                    // Fetch the achievement details to show toast
                    const { data } = await supabase
                        .from('achievements')
                        .select('*')
                        .eq('id', payload.new.achievement_id)
                        .single();

                    if (data) {
                        toast(`🏆 ACHIEVEMENT UNLOCKED: ${data.name}`, {
                            description: `${data.description} (+${data.xp_reward} XP)`,
                            duration: 5000,
                            icon: "🎉"
                        });
                        // Refresh achievements list
                        fetchGamificationData(user.id);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            supabase.removeChannel(achievementChannel);
        };
    }, [user, profile.level]);

    const fetchGamificationData = async (userId: string) => {
        // Fetch Profile
        const { data: profileData } = await supabase
            .from('profiles')
            .select('xp, level, title')
            .eq('id', userId)
            .single();

        if (profileData) {
            setProfile(profileData);
        }

        // Fetch Unlocked Achievements
        const { data: userAchievements } = await supabase
            .from('user_achievements')
            .select(`
                unlocked_at,
                achievement:achievements (
                    id, name, description, icon, xp_reward
                )
            `)
            .eq('user_id', userId);

        if (userAchievements) {
            const formatted = userAchievements.map((ua: any) => ({
                ...ua.achievement,
                unlocked_at: ua.unlocked_at
            }));
            setAchievements(formatted);
        }
    };

    // Calculate progress to next level (Simple formula: Level * 1000 XP)
    const nextLevelXp = profile.level * 1000;
    const progress = Math.min((profile.xp / nextLevelXp) * 100, 100);

    return {
        profile,
        achievements,
        progress,
        nextLevelXp,
        loading
    };
}
