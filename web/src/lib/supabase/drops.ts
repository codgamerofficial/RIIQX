import { createClient } from "@/lib/supabase/server";

export interface Drop {
    id: string;
    name: string;
    description: string;
    release_date: string;
    status: "upcoming" | "live" | "archived";
    hero_image: string;
    accent_color: string;
}

export async function getActiveDrop(): Promise<Drop | null> {
    const supabase = await createClient();

    // First try to get a live drop
    const { data: liveDrop } = await supabase
        .from("drops")
        .select("*")
        .eq("status", "live")
        .order("release_date", { ascending: false })
        .limit(1)
        .single();

    if (liveDrop) return liveDrop as Drop;

    // Fallback to upcoming drop
    const { data: upcomingDrop } = await supabase
        .from("drops")
        .select("*")
        .eq("status", "upcoming")
        .order("release_date", { ascending: true })
        .limit(1)
        .single();

    return (upcomingDrop as Drop) || null;
}

export async function getAllDrops(): Promise<Drop[]> {
    const supabase = await createClient();

    const { data } = await supabase
        .from("drops")
        .select("*")
        .order("release_date", { ascending: false });

    return (data as Drop[]) || [];
}
