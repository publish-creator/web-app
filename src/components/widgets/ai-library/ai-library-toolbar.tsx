'use client';

import type { Key, ReactNode } from 'react';

import { ListBox, Select, Tag, TagGroup } from '@heroui/react';

import { QuerySearchField } from '@/components/composites/search-field';

type FilterOption = {
  id: string;
  label: string;
};

type SortOption = {
  id: string;
  label: string;
};

type AiLibraryToolbarProps = {
  extra?: ReactNode;
  filter: string;
  filters: FilterOption[];
  onFilterChange: (id: string) => void;
  onQueryChange: (value: string) => void;
  onSortChange: (id: string) => void;
  placeholder: string;
  query: string;
  sort: string;
  sorts: SortOption[];
};

export function AiLibraryToolbar({
  extra,
  filter,
  filters,
  onFilterChange,
  onQueryChange,
  onSortChange,
  placeholder,
  query,
  sort,
  sorts,
}: AiLibraryToolbarProps) {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
      <QuerySearchField
        inputValue={query}
        onClear={() => onQueryChange('')}
        onInputChange={onQueryChange}
        placeholder={placeholder}
      />
      <TagGroup
        aria-label="Filters"
        className="min-w-0 flex-1"
        selectedKeys={new Set([filter])}
        selectionMode="single"
        size="sm"
        onSelectionChange={(keys) => {
          if (keys === 'all') return;

          const next = Array.from(keys)[0];

          if (next != null) onFilterChange(String(next));
        }}
      >
        <TagGroup.List>
          {filters.map((item) => (
            <Tag
              className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              id={item.id}
              key={item.id}
            >
              {item.label}
            </Tag>
          ))}
        </TagGroup.List>
      </TagGroup>
      <div className="flex flex-wrap items-center gap-2">
        {extra}
        <LibrarySelect
          ariaLabel="Sort"
          onChange={onSortChange}
          options={sorts}
          prefix="Sort:"
          value={sort}
        />
      </div>
    </div>
  );
}

type LibrarySelectProps = {
  ariaLabel: string;
  onChange: (id: string) => void;
  options: readonly SortOption[];
  prefix?: string;
  value: string;
};

export function LibrarySelect({ ariaLabel, onChange, options, prefix, value }: LibrarySelectProps) {
  return (
    <Select
      aria-label={ariaLabel}
      className="w-50"
      value={value}
      variant="secondary"
      onChange={(next) => {
        if (next != null) onChange(String(next as Key));
      }}
    >
      <Select.Trigger>
        {prefix ? <span className="text-muted">{prefix}</span> : null}
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item id={option.id} key={option.id} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
