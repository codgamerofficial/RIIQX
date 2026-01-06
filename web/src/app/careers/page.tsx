"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Code2, Palette, Cpu, Globe } from "lucide-react";

const jobs = [
    {
        title: "Frontend Architect",
        dept: "Engineering",
        type: "Full-time",
        icon: <Code2 className="w-8 h-8 text-cyan-400" />,
        desc: "Shape the visual future of RIIQX. Expert mastery of React, WebGL, and Framer Motion required."
    },
    {
        title: "Visual Designer",
        dept: "Design",
        type: "Remote",
        icon: <Palette className="w-8 h-8 text-pink-400" />,
        desc: "Create assets that defy physics. Experience with 3D modeling and cinematic UI composition."
    },
    {
        title: "AI Operative",
        dept: "Research",
        type: "Hybrid",
        icon: <Cpu className="w-8 h-8 text-purple-400" />,
        desc: "Develop our core AI personalization engine. Deep learning and Python expertise needed."
    },
    {
        title: "Global Strategist",
        dept: "Operations",
        type: "Full-time",
        icon: <Globe className="w-8 h-8 text-green-400" />,
        desc: "Expand the RIIQX influence across the metaverse and physical realms."
    }
];

export default function CareersPage() {
    return (
        <main className="bg-black min-h-screen pt-32 pb-20 px-4 md:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-20">
                {/* Header */}
                <div className="text-center space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-white tracking-tighter"
                    >
                        JOIN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">FLEET</span>
                    </motion.h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We are looking for visionaries, rebels, and creators to help us build the next generation of digital commerce.
                    </p>
                </div>

                {/* Job Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {jobs.map((job, idx) => (
                        <JobCard key={idx} job={job} index={idx} />
                    ))}
                </div>
            </div>
        </main>
    );
}

function JobCard({ job, index }: { job: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, rotateX: 5, rotateY: 2 }}
            className="group relative bg-white/5 border border-white/10 p-8 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300 perspective-1000 cursor-pointer"
        >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-6 h-6 text-white" />
            </div>

            <div className="space-y-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center shadow-xl">
                    {job.icon}
                </div>

                <div>
                    <div className="flex items-center gap-3 mb-2 text-xs font-mono tracking-widest uppercase text-white/40">
                        <span>{job.dept}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{job.title}</h3>
                </div>

                <p className="text-gray-400 leading-relaxed">
                    {job.desc}
                </p>

                <div className="pt-4 flex items-center gap-2 text-sm font-bold text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <span>Apply Now</span>
                    <div className="h-px w-8 bg-white" />
                </div>
            </div>
        </motion.div>
    );
}
