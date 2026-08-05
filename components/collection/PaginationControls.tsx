'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-3 pt-12 border-t border-glass-border-subtle font-mono text-xs">
      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        leftIcon={<ChevronLeft className="w-4 h-4" />}
      >
        PREV
      </Button>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`w-8 h-8 rounded-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-accent-crimson text-white shadow-glow-crimson'
                  : 'bg-charcoal-matte border border-glass-border-subtle text-riiqxText-muted hover:text-white hover:border-glass-border-medium'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
        rightIcon={<ChevronRight className="w-4 h-4" />}
      >
        NEXT
      </Button>
    </div>
  );
};
