'use client';

import type { Key } from '@heroui/react';
import { Autocomplete, EmptyState, ListBox, SearchField, useFilter } from '@heroui/react';

interface RootOfferMultiSelectProps {
  label: string;
  placeholder: string;
  options: { id: string; name: string; icon?: string }[];
  value: string[];
  onChange: (ids: string[]) => void;
  className?: string;
  labelPlacement?: 'above' | 'inline';
}

export const RootOfferMultiSelect = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  className,
  labelPlacement = 'above',
}: RootOfferMultiSelectProps) => {
  const { contains } = useFilter({ sensitivity: 'base' });
  const inline = labelPlacement === 'inline';

  return (
    <div className={inline ? className : `flex flex-col gap-1.5 ${className ?? ''}`}>
      {inline ? null : <span className="text-muted text-xs font-medium">{label}</span>}
      <Autocomplete
        aria-label={label}
        className="w-full"
        onChange={(key: Key | Key[] | null) => {
          if (Array.isArray(key)) onChange(key.map(String));
          else if (key == null) onChange([]);
        }}
        placeholder={placeholder}
        selectionMode="multiple"
        value={value}
        variant="secondary"
      >
        <Autocomplete.Trigger>
          {inline ? <span className="text-muted text-sm">{label}</span> : null}
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
              {options.map((option) => (
                <ListBox.Item id={option.id} key={option.id} textValue={option.name}>
                  {option.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element -- bandeiras vêm de um CDN externo; next/image exigiria allowlist
                    <img alt="" className="size-4 shrink-0 rounded-full" src={option.icon} />
                  ) : null}
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
