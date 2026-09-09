'use client';

import { SearchField, ToggleButton, ToggleButtonGroup } from '@heroui/react';

import { STATUS_TABS } from './root-offers.constants';

interface RootOffersFiltersProps {
  search: string;
  tab: string;
  onSearchChange: (value: string) => void;
  onTabChange: (tab: string) => void;
}

const toggleClass =
  'rounded-full bg-transparent text-muted data-[selected=true]:bg-surface-secondary data-[selected=true]:text-foreground';

export const RootOffersFilters = ({
  search,
  tab,
  onSearchChange,
  onTabChange,
}: RootOffersFiltersProps) => (
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <ToggleButtonGroup
      aria-label="Filtrar por status"
      className="flex flex-wrap gap-1"
      onSelectionChange={(keys) => {
        const [first] = [...keys];

        if (typeof first === 'string') onTabChange(first);
      }}
      selectedKeys={new Set([tab])}
      selectionMode="single"
    >
      {STATUS_TABS.map((option) => (
        <ToggleButton className={toggleClass} id={option.id} key={option.id}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>

    <SearchField
      aria-label="Buscar oferta"
      className="md:w-80"
      onChange={onSearchChange}
      value={search}
      variant="secondary"
    >
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input placeholder="Título, descrição ou código" />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  </div>
);
