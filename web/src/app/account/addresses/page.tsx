"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NeonButton } from "@/components/ui/neon-button";
import { ArrowLeft, MapPin, Plus, Trash2, Home, Briefcase } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Address {
    id: string;
    type: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    is_default: boolean;
}

export default function ManageAddressesPage() {
    const router = useRouter();
    const supabase = createClient();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // New Address State
    const [newAddress, setNewAddress] = useState({ type: "Home", street: "", city: "", state: "", zip: "", country: "", is_default: false });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/auth");
            return;
        }

        const { data, error } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            toast.error("Failed to load addresses");
        } else {
            const fetched = data as any;
            setAddresses(fetched || []);
        }
        setLoading(false);
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // If this is the first address, make it default
        const isDefault = addresses.length === 0 || newAddress.is_default;

        const { data, error } = await supabase
            .from("addresses")
            .insert({
                user_id: user.id,
                type: newAddress.type,
                street: newAddress.street,
                city: newAddress.city,
                state: newAddress.state,
                zip: newAddress.zip,
                country: newAddress.country,
                is_default: isDefault
            } as any)
            .select()
            .single();

        if (error) {
            toast.error("Failed to add address");
            console.error(error);
        } else {
            setAddresses([data, ...addresses]);
            setShowAddForm(false);
            setNewAddress({ type: "Home", street: "", city: "", state: "", zip: "", country: "", is_default: false });
            toast.success("Address added successfully");
        }
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from("addresses")
            .delete()
            .eq("id", id);

        if (error) {
            toast.error("Failed to delete address");
        } else {
            setAddresses(addresses.filter(a => a.id !== id));
            toast.success("Address removed");
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/account" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <ArrowLeft className="w-6 h-6 text-white" />
                        </Link>
                        <h1 className="text-3xl font-bold text-white">My Addresses</h1>
                    </div>
                    <NeonButton variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
                        <Plus className="w-4 h-4 mr-2" /> Add New
                    </NeonButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address List */}
                    <AnimatePresence>
                        {addresses.map((addr) => (
                            <motion.div
                                key={addr.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-card border border-white/5 rounded-2xl p-6 relative group overflow-hidden"
                            >
                                {addr.is_default && (
                                    <div className="absolute top-0 right-0 bg-primary/20 text-primary text-xs px-3 py-1 rounded-bl-xl font-medium">
                                        Default
                                    </div>
                                )}
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        {addr.type === "Work" ? <Briefcase className="w-6 h-6 text-secondary" /> : <Home className="w-6 h-6 text-primary" />}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            {addr.type}
                                        </h3>
                                        <p className="text-gray-400">{addr.street}</p>
                                        <p className="text-gray-400">{addr.city}, {addr.state} {addr.zip}</p>
                                        <p className="text-gray-500 text-sm">{addr.country}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(addr.id)}
                                    className="absolute bottom-4 right-4 p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {!loading && addresses.length === 0 && !showAddForm && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No addresses found. Add one to get started.
                        </div>
                    )}
                </div>

                {/* Add Form Modal/Section */}
                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-card border border-primary/20 rounded-2xl p-6 md:p-8 overflow-hidden"
                        >
                            <h2 className="text-xl font-bold text-white mb-6">Add New Address</h2>
                            <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="label">Street Address</label>
                                    <input
                                        required
                                        className="input-field"
                                        placeholder="1234 Space Station Way"
                                        value={newAddress.street}
                                        onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">City</label>
                                    <input
                                        required
                                        className="input-field"
                                        placeholder="Neo City"
                                        value={newAddress.city}
                                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">State / Province</label>
                                    <input
                                        required
                                        className="input-field"
                                        placeholder="Sector 7"
                                        value={newAddress.state}
                                        onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Zip / Postal Code</label>
                                    <input
                                        required
                                        className="input-field"
                                        placeholder="X99-001"
                                        value={newAddress.zip}
                                        onChange={e => setNewAddress({ ...newAddress, zip: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Country</label>
                                    <input
                                        required
                                        className="input-field"
                                        placeholder="India"
                                        value={newAddress.country}
                                        onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Type</label>
                                    <select
                                        className="input-field"
                                        value={newAddress.type}
                                        onChange={e => setNewAddress({ ...newAddress, type: e.target.value })}
                                    >
                                        <option>Home</option>
                                        <option>Work</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                    <NeonButton type="button" variant="secondary" onClick={() => setShowAddForm(false)}>Cancel</NeonButton>
                                    <NeonButton type="submit" variant="primary">Save Address</NeonButton>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <style jsx>{`
                    .label { display: block; color: #9ca3af; font-size: 0.875rem; margin-bottom: 0.5rem; }
                    .input-field { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.5rem 1rem; color: white; outline: none; transition: all 0.2s; }
                    .input-field:focus { border-color: #8b5cf6; }
                `}</style>
            </div>
        </div>
    );
}
