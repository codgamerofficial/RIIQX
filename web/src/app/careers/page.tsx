"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Code2, Palette, Cpu, Globe, Send, Upload } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const jobs = [
    {
        title: "Frontend Architect",
        dept: "Engineering",
        type: "Full-time",
        icon: <Code2 className="w-8 h-8 text-cyan-400" />,
        desc: "Build the future of RIIQX. Expert mastery of React & WebGL required."
    },
    {
        title: "Visual Designer",
        dept: "Design",
        type: "Remote",
        icon: <Palette className="w-8 h-8 text-pink-400" />,
        desc: "Create assets that defy physics. 3D modeling experience is key."
    },
    {
        title: "Content Creator",
        dept: "Marketing",
        type: "Hybrid",
        icon: <Globe className="w-8 h-8 text-green-400" />,
        desc: "Tell the RIIQX story. Video editing and storytelling skills needed."
    },
    {
        title: "Business Analyst",
        dept: "Operations",
        type: "Full-time",
        icon: <Cpu className="w-8 h-8 text-purple-400" />,
        desc: "Analyze the game. Data-driven decision making for global expansion."
    }
];

export default function CareersPage() {
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        role: "",
        portfolioUrl: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email || !formData.role) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('applications')
                .insert({
                    full_name: formData.fullName,
                    email: formData.email,
                    role: formData.role,
                    portfolio_url: formData.portfolioUrl,
                    message: formData.message
                });

            if (error) throw error;

            toast.success("Application transmitted to HQ.");
            setFormData({ fullName: "", email: "", role: "", portfolioUrl: "", message: "" });
        } catch (error) {
            console.error('Application error:', error);
            toast.error("Transmission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-black min-h-screen pt-32 pb-20 px-4 md:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-24">
                    <span className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.3em] backdrop-blur-md mb-6 text-cyan-400">
                        We Are Hiring
                    </span>
                    <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-6 font-display">
                        Join The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Roster</span>
                    </h1>
                    <p className="text-xl text-white/40 max-w-2xl mx-auto font-mono uppercase tracking-wide">
                        We are looking for visionaries to build the next generation of digital commerce.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Job Grid */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4 opacity-50">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-xs uppercase tracking-widest">Open Positions</span>
                        </div>
                        {jobs.map((job, idx) => (
                            <JobCard key={idx} job={job} index={idx} />
                        ))}
                    </div>

                    {/* Application Form */}
                    <div className="lg:sticky lg:top-32">
                        <div className="bg-[#121212] border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none" />

                            <h3 className="text-3xl font-black text-white uppercase mb-8 font-display">Apply Now</h3>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-[#1c1c1e] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-hidden transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Email Coordinates</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-[#1c1c1e] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-hidden transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Role Applying For</label>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-[#1c1c1e] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-hidden transition-all appearance-none"
                                    >
                                        <option value="" disabled>Select a role</option>
                                        <option value="Frontend Architect">Frontend Architect</option>
                                        <option value="Visual Designer">Visual Designer</option>
                                        <option value="Content Creator">Content Creator</option>
                                        <option value="Business Analyst">Business Analyst</option>
                                        <option value="Android/iOS Dev">Android/iOS Developer</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Resume / Portfolio Link</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.portfolioUrl}
                                            onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                                            className="w-full bg-[#1c1c1e] border border-white/5 rounded-xl px-4 py-3 pl-10 text-white focus:border-cyan-500 outline-hidden transition-all"
                                            placeholder="https://..."
                                        />
                                        <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Cover Letter</label>
                                    <textarea
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-[#1c1c1e] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-hidden transition-all h-32 resize-none"
                                        placeholder="Tell us why you fit the squad..."
                                    />
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    {isSubmitting ? "Transmitting..." : "Submit Application"}
                                    {!isSubmitting && <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </button>

                                <p className="text-[10px] text-white/20 text-center uppercase tracking-wide">
                                    *Applications are reviewed by our HR squad at thelegacyroars@gmail.com
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function JobCard({ job, index }: { job: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="group relative bg-[#121212] border border-white/5 p-8 rounded-[32px] overflow-hidden hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
        >
            <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                    {job.icon}
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-2 text-[10px] font-mono tracking-widest uppercase text-white/40">
                        <span>{job.dept}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">{job.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {job.desc}
                    </p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
            </div>
        </motion.div>
    );
}
