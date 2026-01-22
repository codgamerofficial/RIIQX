'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    showNumber?: boolean;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
}

export function StarRating({
    rating,
    maxRating = 5,
    size = 'md',
    showNumber = false,
    interactive = false,
    onRatingChange,
}: StarRatingProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const handleClick = (newRating: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(newRating);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: maxRating }, (_, i) => {
                const starValue = i + 1;
                const isFilled = starValue <= Math.round(rating);
                const isPartial = starValue > rating && starValue - 1 < rating;

                return (
                    <button
                        key={i}
                        type="button"
                        onClick={() => handleClick(starValue)}
                        disabled={!interactive}
                        className={cn(
                            'relative',
                            interactive && 'cursor-pointer hover:scale-110 transition-transform'
                        )}
                    >
                        <Star
                            className={cn(
                                sizeClasses[size],
                                isFilled ? 'fill-gold text-gold' : 'text-gray-300',
                                interactive && 'hover:text-gold'
                            )}
                        />
                        {isPartial && (
                            <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
                                <Star className={cn(sizeClasses[size], 'fill-gold text-gold')} />
                            </div>
                        )}
                    </button>
                );
            })}
            {showNumber && (
                <span className="text-sm font-semibold text-gray-700 ml-1">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
