'use client';

import { useEffect, useState } from 'react';
import { Eye, TrendingUp } from 'lucide-react';

interface ProductActivityProps {
    productId: string;
    initialViews?: number;
}

const [viewCount, setViewCount] = useState(initialViews);
const [viewersNow, setViewersNow] = useState(0);

useEffect(() => {
    // Increment view count slightly on mount logic
    const newCount = initialViews + Math.floor(Math.random() * 5) + 1;
    setViewCount(newCount);

    // Set initial viewers now
    setViewersNow(Math.floor(newCount / 10) + Math.floor(Math.random() * 5) + 1);

    // Simulate other viewers
    const interval = setInterval(() => {
        setViewCount(prev => {
            const updated = prev + Math.floor(Math.random() * 3);
            setViewersNow(Math.floor(updated / 10) + Math.floor(Math.random() * 5) + 1);
            return updated;
        });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
}, [productId, initialViews]);

return (
    <div className="flex items-center gap-4 text-sm">
        {/* View Count */}
        <div className="flex items-center gap-2 text-neutral-gray">
            <Eye className="w-4 h-4" />
            <span>{viewCount.toLocaleString()} views</span>
        </div>

        {/* Live Viewers - Only show on client */}
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
