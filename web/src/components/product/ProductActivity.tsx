'use client';

import { useEffect, useState } from 'react';
import { Eye, TrendingUp } from 'lucide-react';

interface ProductActivityProps {
    productId: string;
    initialViews?: number;
}

export function ProductActivity({ productId, initialViews = 0 }: ProductActivityProps) {
    const [viewCount, setViewCount] = useState(initialViews);
    const [isViewing, setIsViewing] = useState(false);

    useEffect(() => {
        // Simulate real-time view count
        setIsViewing(true);

        // Increment view count
        const newCount = initialViews + Math.floor(Math.random() * 5) + 1;
        setViewCount(newCount);

        // Simulate other viewers
        const interval = setInterval(() => {
            setViewCount(prev => prev + Math.floor(Math.random() * 3));
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, [productId, initialViews]);

    const viewersNow = Math.floor(viewCount / 10) + Math.floor(Math.random() * 5) + 1;

    return (
        <div className="flex items-center gap-4 text-sm">
            {/* View Count */}
            <div className="flex items-center gap-2 text-neutral-gray">
                <Eye className="w-4 h-4" />
                <span>{viewCount.toLocaleString()} views</span>
            </div>

            {/* Live Viewers */}
            {viewersNow > 0 && (
                <div className="flex items-center gap-2 text-cherry-red">
                    <div className="relative">
                        <TrendingUp className="w-4 h-4" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-cherry-red rounded-full animate-pulse" />
                    </div>
                    <span className="font-semibold">
                        {viewersNow} {viewersNow === 1 ? 'person' : 'people'} viewing now
                    </span>
                </div>
            )}
        </div>
    );
}
