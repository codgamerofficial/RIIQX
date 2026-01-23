"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { MapPin, Plus, Trash2, Edit2, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        street_address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "India",
        phone: "",
        is_default: false
    });

    const supabase = createClient();

    const fetchAddresses = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', user.id)
                .order('is_default', { ascending: false });
            setAddresses(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        // If setting as default, unset others first (optional, triggers can handle this but simpler here for now)
        if (formData.is_default) {
            await supabase
                .from('addresses')
                .update({ is_default: false })
                .eq('user_id', user.id);
        }

        const { error } = await supabase.from('addresses').insert({
            ...formData,
            user_id: user.id
        });

        if (!error) {
            setIsAdding(false);
            setFormData({
                full_name: "",
                street_address: "",
                city: "",
                state: "",
                zip_code: "",
                country: "India",
                phone: "",
                is_default: false
            });
            fetchAddresses();
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this address?")) {
            await supabase.from('addresses').delete().eq('id', id);
            fetchAddresses();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Saved Addresses</h1>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 text-sm font-bold text-bewakoof-yellow hover:text-yellow-400 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add New Address
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-neutral-800 border border-white/10 p-6 rounded-xl space-y-4 overflow-hidden"
                        onSubmit={handleSubmit}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                placeholder="Full Name"
                                required
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none"
                            />
                            <input
                                placeholder="Phone Number"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none"
                            />
                            <input
                                placeholder="Street Address"
                                required
                                className="md:col-span-2 w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none"
                                value={formData.street_address}
                                onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                            />
                            <input
                                placeholder="City"
                                required
                                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                            <input
                                placeholder="State"
                                required
                                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            />
                            <input
                                placeholder="ZIP Code"
                                required
                                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none"
                                value={formData.zip_code}
                                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                            />
                            <input
                                placeholder="Country"
                                required
                                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_default}
                                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                                className="rounded border-white/20 bg-neutral-900 text-bewakoof-yellow focus:ring-bewakoof-yellow"
                            />
                            <span className="text-sm text-muted-foreground">Set as default address</span>
                        </label>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-4 py-2 text-sm text-muted-foreground hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bewakoof-btn bewakoof-btn-primary px-6 py-2 text-sm"
                            >
                                {loading ? "Saving..." : "Save Address"}
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {loading && !isAdding ? (
                <div className="text-white">Loading addresses...</div>
            ) : addresses.length === 0 && !isAdding ? (
                <div className="text-center py-12 bg-neutral-800/30 border border-white/5 rounded-xl">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No addresses saved yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="bg-neutral-800/50 border border-white/5 p-6 rounded-xl relative group">
                            {addr.is_default && (
                                <span className="absolute top-4 right-4 bg-bewakoof-yellow text-black text-[10px] font-bold px-2 py-1 rounded">
                                    DEFAULT
                                </span>
                            )}
                            <h3 className="font-bold text-white mb-1">{addr.full_name}</h3>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>{addr.street_address}</p>
                                <p>{addr.city}, {addr.state} {addr.zip_code}</p>
                                <p>{addr.country}</p>
                                <p className="pt-2 text-white/60">{addr.phone}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDelete(addr.id)}
                                    className="text-xs font-bold text-neon-red hover:underline flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
