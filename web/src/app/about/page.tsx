import { AboutHero } from "@/components/about/AboutHero";
import { BioSection } from "@/components/about/BioSection";
import { ExperienceTimeline } from "@/components/about/ExperienceTimeline";
import { TechStack } from "@/components/about/TechStack";
import { RiiqxStory } from "@/components/about/RiiqxStory";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black overflow-x-hidden selection:bg-primary/30">
            <AboutHero />
            <BioSection />
            <ExperienceTimeline />
            <RiiqxStory />
            <TechStack />
        </main>
    );
}
