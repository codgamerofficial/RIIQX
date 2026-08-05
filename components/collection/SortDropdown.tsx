'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select, type SelectOption } from '@/components/ui/Select';

export interface SortDropdownProps {
  currentSort?: string;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort = 'newest' }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortOptions: SelectOption[] = [
    { value: 'newest', label: 'SORT: NEWEST DROPS' },
    { value: 'price_asc', label: 'SORT: PRICE (LOW TO HIGH)' },
    { value: 'price_desc', label: 'SORT: PRICE (HIGH TO LOW)' },
    { value: 'bestselling', label: 'SORT: FEATURED DROPS' },
  ];

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    params.set('page', '1'); // Reset to page 1 on sort change
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full sm:w-64">
      <Select
        options={sortOptions}
        value={currentSort}
        onChange={handleSortChange}
        placeholder="SORT DROPS"
      />
    </div>
  );
};
