'use client';

import { useMemo, useState } from 'react';

import { AiLibraryAvatarCard } from './ai-library-avatar-card';
import { AiLibraryCreateCard } from './ai-library-create-card';
import { AiLibraryToolbar } from './ai-library-toolbar';
import { AVATAR_SORTS, AVATARS } from './ai-library.constants';

import type { AvatarItem, AvatarStatus } from './ai-library.constants';

type AvatarFilter = 'all' | AvatarStatus;
type AvatarSort = (typeof AVATAR_SORTS)[number]['id'];

const AVATAR_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'ready', label: 'Available' },
  { id: 'in-use', label: 'In use' },
];

function chunkItems<T>(items: T[], size: number) {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }

  return rows;
}

function sortAvatars(avatars: AvatarItem[], sort: AvatarSort) {
  if (sort === 'name') {
    return [...avatars].sort((left, right) => left.name.localeCompare(right.name));
  }

  if (sort === 'videos') {
    return [...avatars].sort((left, right) => right.videos - left.videos);
  }

  return avatars;
}

export function AiLibraryAvatarGrid() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<AvatarFilter>('all');
  const [sort, setSort] = useState<AvatarSort>('recent');
  const [selectedId, setSelectedId] = useState('ray');

  const avatars = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const filtered = AVATARS.filter((avatar) => {
      const matchesFilter = filter === 'all' || avatar.status === filter;
      const matchesQuery =
        normalized.length === 0 ||
        avatar.name.toLowerCase().includes(normalized) ||
        avatar.role.toLowerCase().includes(normalized);

      return matchesFilter && matchesQuery;
    });

    return sortAvatars(filtered, sort);
  }, [filter, query, sort]);

  const firstRow = avatars.slice(0, 3);
  const remainingRows = chunkItems(avatars.slice(3), 3);

  return (
    <div className="flex flex-col gap-4">
      <AiLibraryToolbar
        filter={filter}
        filters={AVATAR_FILTERS}
        onFilterChange={(id) => setFilter(id as AvatarFilter)}
        onQueryChange={setQuery}
        onSortChange={(id) => setSort(id as AvatarSort)}
        placeholder="Search avatars"
        query={query}
        sort={sort}
        sorts={[...AVATAR_SORTS]}
      />

      <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AiLibraryCreateCard />
        {firstRow.map((avatar) => (
          <AiLibraryAvatarCard
            avatar={avatar}
            isSelected={selectedId === avatar.id}
            key={avatar.id}
            onSelect={setSelectedId}
          />
        ))}
      </div>

      {remainingRows.map((row) => (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          key={row.map((item) => item.id).join('-')}
        >
          {row.map((avatar) => (
            <AiLibraryAvatarCard
              avatar={avatar}
              isSelected={selectedId === avatar.id}
              key={avatar.id}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
