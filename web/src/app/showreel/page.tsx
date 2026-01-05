import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Showreel | RIIQX',
    description: 'Experience the RIIQX cinematic universe.',
};

export default function ShowreelPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-black pointer-events-none" />

            <div className="absolute top-8 left-8 z-50">
                <Link href="/" className="flex items-center text-white/70 hover:text-white transition-colors group">
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
            </div>

            <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-4">
                        THE <span className="text-primary text-glow">SHOWREEL.</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        A visual journey through the RIIQX aesthetic.
                    </p>
                </div>

                {/* Video Container */}
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(124,58,237,0.2)] bg-zinc-900 group">
                    {/* Placeholder for actual video - using a cinematic generic background or loading state */}
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform duration-500 cursor-pointer">
                                <Play className="w-8 h-8 fill-white ml-1" />
                            </div>
                            <p className="text-white/50 text-sm tracking-widest uppercase">
                                Cinematic Trailer Loading...
                            </p>
                        </div>
                    </div>

                    {/* If you had a real URL:
                    <iframe 
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=0&controls=0&loop=1" 
                        title="RIIQX Showreel" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen 
                    />
                    */}
                </div>
            </div>
        </div>
    );
}
