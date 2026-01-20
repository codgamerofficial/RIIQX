"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface TeamMember {
    name: string;
    role: string;
    image: string;
    linkedin?: string;
    twitter?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
    {
        name: "Avery Davis",
        role: "Marketing",
        image: "/assets/team/avery-davis.jpg",
        linkedin: "https://linkedin.com/in/averydavis"
    },
    {
        name: "SASWATA DEY",
        role: "CEO",
        image: "/assets/team/saswata-dey.jpg",
        linkedin: "https://linkedin.com/in/saswatadey"
    },
    {
        name: "Chiaki Sato",
        role: "Manager",
        image: "/assets/team/chiaki-sato.jpg",
        linkedin: "https://linkedin.com/in/chiakisato"
    }
];

export function TeamShowcase() {
    return (
        <section className="relative bg-black py-20 md:py-32 overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                {/* Section Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl md:text-7xl font-black text-lime-400 mb-4 tracking-tight uppercase"
                        style={{
                            textShadow: '0 0 30px rgba(132, 204, 22, 0.5)'
                        }}
                    >
                        MEET OUR TEAM
                    </h2>
                </motion.div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
                    {TEAM_MEMBERS.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="group relative"
                        >
                            {/* Image Container */}
                            <div className="relative mb-6 overflow-hidden bg-white p-4 shadow-2xl">
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                {/* Arrow Icon - Top Right */}
                                {member.linkedin && (
                                    <Link
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute top-6 right-6 w-12 h-12 bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-lime-400"
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="text-white group-hover:text-black transition-colors"
                                        >
                                            <path d="M7 17L17 7M17 7H7M17 7v10" />
                                        </svg>
                                    </Link>
                                )}
                            </div>

                            {/* Member Info */}
                            <div className="text-center">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight uppercase">
                                    {member.name}
                                </h3>
                                <p className="text-lg text-white/60">
                                    ({member.role})
                                </p>
                            </div>

                            {/* Hover Effect - Bottom Border */}
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-1 bg-lime-400"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ duration: 0.3 }}
                                style={{ transformOrigin: 'left' }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Optional: Join Team CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-center mt-16"
                >
                    <p className="text-white/60 text-lg mb-6">
                        Want to join our team?
                    </p>
                    <Link href="/careers">
                        <motion.button
                            className="px-8 py-4 bg-lime-400 text-black font-bold text-lg uppercase tracking-wider rounded-full hover:bg-white transition-colors duration-300 shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            View Open Positions
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
