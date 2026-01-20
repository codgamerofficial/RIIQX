import { AboutHero } from "@/components/about/AboutHero";
import { BioSection } from "@/components/about/BioSection";
import { ExperienceTimeline } from "@/components/about/ExperienceTimeline";
import { TechStack } from "@/components/about/TechStack";
import { RiiqxStory } from "@/components/about/RiiqxStory";
import { AboutIntroduction } from "@/components/about/AboutIntroduction";
import { TeamShowcase } from "@/components/about/TeamShowcase";
import { PortfolioShowcase } from "@/components/about/PortfolioShowcase";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black overflow-x-hidden selection:bg-primary/30">
            <AboutHero />

            {/* New Premium Sections */}
            <AboutIntroduction />
            <TeamShowcase />
            <PortfolioShowcase />

            {/* Existing Sections */}
            <BioSection />
            <ExperienceTimeline />
            <RiiqxStory />
            <TechStack />
        </main>
    );
}
