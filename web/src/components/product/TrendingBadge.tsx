import { Flame } from 'lucide-react';

interface TrendingBadgeProps {
    rank?: number;
}

export function TrendingBadge({ rank }: TrendingBadgeProps) {
    return (
        <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-cherry-red to-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                <Flame className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wide">
                    {rank ? `#${rank} Trending` : 'Trending'}
                </span>
            </div>
        </div>
    );
}
