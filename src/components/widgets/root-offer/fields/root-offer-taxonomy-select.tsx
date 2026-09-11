'use client';

import type { Key } from '@heroui/react';
import { Autocomplete, EmptyState, ListBox, SearchField, useFilter } from '@heroui/react';

interface RootOfferTaxonomySelectProps {
  label: string;
  options: { id: string; name: string }[];
  value: string | null;
  onChange: (id: string | null) => void;
  isInvalid?: boolean;
  allowEmpty?: boolean;
}

export const RootOfferTaxonomySelect = ({
  label,
  options,
  value,
  onChange,
  isInvalid,
  allowEmpty,
}: RootOfferTaxonomySelectProps) => {
  const { contains } = useFilter({ sensitivity: 'base' });

  const entries = allowEmpty ? [{ id: '', name: 'Nenhum' }, ...options] : options;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-muted text-xs font-medium">{label}</span>
      <Autocomplete
        aria-label={label}
        className="w-full"
        isInvalid={Boolean(isInvalid)}
        onChange={(key: Key | Key[] | null) => {
          if (typeof key === 'string') onChange(key || null);
        }}
        placeholder={`Selecione ${label.toLowerCase()}`}
        selectionMode="single"
        value={value ?? ''}
        variant="secondary"
      >
        <Autocomplete.Trigger>
          <Autocomplete.Value />
          <Autocomplete.Indicator />
        </Autocomplete.Trigger>
        <Autocomplete.Popover>
          <Autocomplete.Filter filter={contains}>
            <SearchField aria-label={`Buscar ${label}`} autoFocus name="search" variant="secondary">
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder="Buscar..." />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
            <ListBox renderEmptyState={() => <EmptyState>Nada encontrado</EmptyState>}>
              {entries.map((option) => (
                <ListBox.Item id={option.id} key={option.id || 'none'} textValue={option.name}>
                  {option.name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Autocomplete.Filter>
        </Autocomplete.Popover>
      </Autocomplete>
    </div>
  );
};
