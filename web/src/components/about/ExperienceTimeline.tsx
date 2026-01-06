"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Briefcase, GraduationCap } from "lucide-react";

const experiences = [
    {
        id: 1,
        type: "work",
        title: "Drone Data Processor (GIS Intern)",
        company: "Digital Indian Business Solution Pvt. Ltd.",
        period: "Aug 2025 – Nov 2025",
        desc: "Processed and analyzed drone and GIS data for mapping and infrastructure. Used ArcGIS, QGIS, and photogrammetry tools.",
    },
    {
        id: 2,
        type: "work",
        title: "Sales & Marketing Intern",
        company: "HighRadius Technologies",
        period: "May 2024 – Jun 2024",
        desc: "Conducted B2B lead generation and CRM-based outreach. Delivered product demos and managed client relationships.",
    },
    {
        id: 3,
        type: "education",
        title: "B.Tech in Computer Science",
        company: "KIIT University",
        period: "2022 – 2025",
        desc: "CGPA: 6.15. Focus on Software Engineering and QA.",
    },
    {
        id: 4,
        type: "education",
        title: "Diploma in Computer Science",
        company: "KIIT Polytechnic",
        period: "2019 – 2022",
        desc: "Percentage: 71%. Foundation in programming.",
    },
    {
        id: 5,
        type: "education",
        title: "Matriculation (10th)",
        company: "Contai High School",
        period: "2018 – 2019",
        desc: "Percentage: 68%.",
    },
];

export function ExperienceTimeline() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-black">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <div className="absolute top-10 left-10 z-10">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">My Journey</h2>
                    <p className="text-white/50 text-sm mt-2">Scroll down to explore timeline</p>
                </div>

                <motion.div style={{ x }} className="flex gap-16 px-24">
                    {experiences.map((exp) => (
                        <div
                            key={exp.id}
                            className="group relative h-[400px] w-[350px] md:w-[450px] flex-shrink-0 rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-md overflow-hidden hover:bg-white/10 transition-colors"
                        >
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`p-3 rounded-xl ${exp.type === 'work' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                            {exp.type === 'work' ? <Briefcase className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
                                        </div>
                                        <span className="text-xs font-mono text-white/40 border border-white/10 px-3 py-1 rounded-full">{exp.period}</span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                                    <h4 className="text-primary font-medium mb-4">{exp.company}</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{exp.desc}</p>
                                </div>

                                <div className="text-9xl font-black text-white/5 absolute bottom-0 right-0 pointer-events-none select-none">
                                    0{exp.id}
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
