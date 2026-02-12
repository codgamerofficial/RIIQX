export default function Loading() {
    return (
        <div className="fixed inset-0 bg-[#050505] z-[9999] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-2 border-white/10 border-t-[#B4F000] rounded-full animate-spin" />
                <p className="text-[#B4F000] font-mono text-xs uppercase tracking-[0.2em] animate-pulse">
                    Initializing...
                </p>
            </div>
        </div>
    );
}
