import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { OrderHistory } from "@/components/dashboard/OrderHistory";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth");
    }

    // Fetch Profile
    const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const profile = data as any;

    // Fetch Orders
    const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-[#121212] pt-32 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* VIP Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-sm font-bold text-[#D9F99D] uppercase tracking-widest mb-2">RIIQX Insider</h1>
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                            Welcome Back, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">{profile?.full_name?.split(' ')[0] || "User"}</span>
                        </h2>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <div className="bg-[#1A1A1A] border border-[#D9F99D]/30 px-6 py-2 rounded-full flex items-center space-x-2 shadow-[0_0_15px_rgba(217,249,157,0.1)]">
                            <div className="w-2 h-2 rounded-full bg-[#D9F99D] animate-pulse" />
                            <span className="text-[#D9F99D] font-bold text-xs uppercase tracking-wider">Status: Active Member</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile */}
                    <div className="lg:col-span-1">
                        <ProfileCard user={user} profile={profile} />
                    </div>

                    {/* Right Column: Orders & Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-8">
                            <OrderHistory orders={orders} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
