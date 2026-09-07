'use client';

import { QuerySearchField } from '@/components/composites/search-field';
import { Button } from '@heroui/react';
import { AddBoldIcon } from '@solar-icons/react';
import { FilterIcon } from '@solar-icons/react/bold';

export default function UsersRootPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <QuerySearchField onClear={() => {}} onInputChange={() => {}} />
        <Button aria-label="Filter" variant="tertiary">
          <FilterIcon className="size-4" />
          Filter
        </Button>
        <Button className="ml-auto">
          <AddBoldIcon className="size-4" />
          <span className="">Add</span>
        </Button>
      </div>
    </div>
  );
}
