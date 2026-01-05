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
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // Fetch Orders
    const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-white mb-8">My Dashboard</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile */}
                    <div className="lg:col-span-1">
                        <ProfileCard user={user} profile={profile} />
                    </div>

                    {/* Right Column: Orders & Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        <OrderHistory orders={orders} />
                    </div>
                </div>
            </div>
        </div>
    );
}
