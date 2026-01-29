import { FileText, Shield, Gavel, AlertTriangle } from "lucide-react";

export default function TermsOfUse() {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-20 text-center">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                        <Gavel className="w-4 h-4 text-accent" />
                        <span className="text-xs font-mono uppercase tracking-widest">Rulebook v2026.1</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter font-display leading-[0.8] mb-6">
                        Match <span className="text-white/20">Rules</span>
                    </h1>
                    <p className="text-white/40 font-mono text-sm max-w-xl mx-auto uppercase tracking-wide">
                        Operating conditions for the RIIQX Terminal. Read carefully before entering the pitch.
                    </p>
                </div>

                {/* Rules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RuleCard
                        number="01"
                        title="Eligibility"
                        icon={<Shield className="w-5 h-5 text-accent" />}
                        text="The RIIQX platform is available only to individuals who can form legally binding contracts. By accessing this site, you certify you meet this criteria."
                    />
                    <RuleCard
                        number="02"
                        title="Intellectual Property"
                        icon={<FileText className="w-5 h-5 text-accent" />}
                        text="All content including designs, logos, 'RIIQX' branding, lookbooks, and 3D assets are exclusive property. Unauthorized reproduction is a foul."
                    />
                    <RuleCard
                        number="03"
                        title="Fair Play"
                        icon={<Gavel className="w-5 h-5 text-accent" />}
                        text="We reserve the right to refuse service to anyone. Product prices and availability are subject to change without notice. Play fair."
                    />
                    <RuleCard
                        number="04"
                        title="Liability"
                        icon={<AlertTriangle className="w-5 h-5 text-accent" />}
                        text="RIIQX Labs shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the service."
                    />
                </div>
            </div>
        </div>
    );
}

function RuleCard({ number, title, icon, text }: { number: string, title: string, icon: React.ReactNode, text: string }) {
    return (
        <div className="bg-[#121212] border border-white/5 p-8 rounded-[32px] hover:border-accent/30 transition-colors group relative overflow-hidden">
            {/* Background Number */}
            <span className="absolute -bottom-4 -right-4 text-9xl font-black text-white/5 select-none font-display group-hover:text-white/10 transition-colors">
                {number}
            </span>

            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                    {icon}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wide">{title}</h3>
            </div>

            <p className="text-white/50 leading-relaxed font-light relative z-10">
                {text}
            </p>
        </div>
    );
}
