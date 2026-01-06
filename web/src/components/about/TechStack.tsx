"use client";

import { motion } from "framer-motion";

const skills = [
    { category: "Languages", items: ["Python", "Java", "JavaScript", "TypeScript", "SQL", "C++", "XML", "CSS", "HTML"] },
    { category: "Web Technologies", items: ["React", "Next.js", "Node.js", "FastAPI"] },
    { category: "Testing & Tools", items: ["Selenium", "Appium", "Postman", "JIRA", "TestNG", "Git", "GitHub"] },
    { category: "Database & Cloud", items: ["MySQL", "PostgreSQL", "Supabase", "Oracle"] },
];

export function TechStack() {
    return (
        <section className="py-32 px-4 bg-black relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Technical Arsenal</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        A curated set of technologies I use to build robust and scalable applications.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {skills.map((skillGroup, groupIndex) => (
                        <div key={groupIndex} className="space-y-6">
                            <h3 className="text-xl font-bold text-primary border-l-4 border-primary pl-4">{skillGroup.category}</h3>
                            <div className="flex flex-wrap gap-3">
                                {skillGroup.items.map((skill, index) => (
                                    <motion.div
                                        key={skill}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 15,
                                            delay: index * 0.05 + groupIndex * 0.1
                                        }}
                                        whileHover={{ scale: 1.1, rotate: Math.random() * 4 - 2 }}
                                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-colors cursor-default"
                                    >
                                        {skill}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
