import { QuerySearchField } from '@/components/composites/search-field';
import { Button } from '@heroui/react';
import { FilterIcon, HeartIcon } from '@solar-icons/react/bold';

export const CreativeFilter = () => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <QuerySearchField
        className=""
        onClear={function (): void {}}
        onInputChange={function (value: string): void {}}
      />
      <Button aria-label="favorite" variant="tertiary">
        <HeartIcon />
        Saved
      </Button>
      <Button aria-label="Filtros" variant="tertiary">
        <FilterIcon />
        Filters
      </Button>
    </div>
  );
};
