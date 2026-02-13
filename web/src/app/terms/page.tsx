import { FileText, Shield, Gavel, AlertTriangle, Scale, CheckCircle2 } from "lucide-react";

export default function TermsOfUse() {
    return (
        <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#B4F000] selection:text-black pt-32 pb-24">

            {/* Background Grid & ambient glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
                <div className="absolute top-[20%] right-0 w-full h-[500px] bg-[#B4F000]/5 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header Section */}
                <div className="mb-24 relative flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Gavel className="w-5 h-5 text-[#B4F000]" />
                            <span className="text-[#B4F000] font-mono text-xs uppercase tracking-[0.2em] font-bold">
                                Governance Protocol // V2.0
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] font-oswald text-white">
                            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4F000] to-white/20">Service</span>
                        </h1>
                    </div>
                    <div className="md:text-right max-w-sm">
                        <p className="text-white/40 font-mono text-sm uppercase tracking-wider leading-relaxed">
                            Operating conditions for the RIIQX Terminal. <br />
                            Read carefully before entering the pitch.
                        </p>
                    </div>
                </div>

                {/* Rules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-24">
                    <RuleCard
                        number="01"
                        title="Eligibility Criteria"
                        icon={<Shield className="w-5 h-5 text-black" />}
                        text="The RIIQX platform is available only to individuals who can form legally binding contracts. By accessing this site, you certify you meet this criteria and are of legal age."
                    />
                    <RuleCard
                        number="02"
                        title="Intellectual Property"
                        icon={<FileText className="w-5 h-5 text-black" />}
                        text="All content including designs, logos, 'RIIQX' branding, lookbooks, and 3D assets are exclusive property of RIIQX Labs. Unauthorized reproduction is a direct violation."
                    />
                    <RuleCard
                        number="03"
                        title="Fair Play Protocol"
                        icon={<Scale className="w-5 h-5 text-black" />}
                        text="We reserve the right to refuse service to anyone for any reason at any time. Product prices and availability are subject to change without notice. Play fair or be banned."
                    />
                    <RuleCard
                        number="04"
                        title="Liability Disclaimer"
                        icon={<AlertTriangle className="w-5 h-5 text-black" />}
                        text="RIIQX Labs shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the service or any products procured."
                    />
                </div>

                {/* Detailed Sections */}
                <div className="max-w-4xl mx-auto space-y-16 border-l border-white/5 pl-8 md:pl-16">
                    <DetailSection
                        title="Returns & Refunds"
                        content="Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately, we can’t offer you a refund or exchange. To be eligible for a return, your item must be unused."
                    />
                    <DetailSection
                        title="Operational Modifications"
                        content="Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time."
                    />
                    <DetailSection
                        title="Governing Law"
                        content="These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the operating jurisdiction."
                    />
                </div>

                <div className="mt-24 border-t border-white/10 pt-12 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#B4F000]/10 border border-[#B4F000]/20 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-[#B4F000]" />
                        <span className="text-[#B4F000] text-xs font-bold uppercase tracking-widest">
                            By using this site, you agree to these terms
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}

function RuleCard({ number, title, icon, text }: { number: string, title: string, icon: React.ReactNode, text: string }) {
    return (
        <div className="bg-[#121212] border border-white/5 p-8 rounded-[2px] hover:border-[#B4F000]/50 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#B4F000]/5 blur-[40px] rounded-full group-hover:bg-[#B4F000]/10 transition-colors" />

            {/* Background Number */}
            <span className="absolute -bottom-4 -right-4 text-9xl font-black text-white/5 select-none font-oswald group-hover:text-white/10 transition-colors">
                {number}
            </span>

            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-sm bg-[#B4F000] flex items-center justify-center shadow-[0_0_15px_rgba(180,240,0,0.3)]">
                    {icon}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wide font-oswald text-white">{title}</h3>
            </div>

            <p className="text-white/50 leading-relaxed font-light relative z-10 text-sm">
                {text}
            </p>
        </div>
    );
}

function DetailSection({ title, content }: { title: string, content: string }) {
    return (
        <div>
            <h3 className="text-2xl font-bold uppercase text-white font-oswald mb-4 flex items-center gap-3">
                <span className="w-1 h-6 bg-[#B4F000]" />
                {title}
            </h3>
            <p className="text-white/60 leading-relaxed font-light">
                {content}
            </p>
        </div>
    )
}
