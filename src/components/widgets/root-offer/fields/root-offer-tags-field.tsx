'use client';

import { Xmark } from '@gravity-ui/icons';
import { useFieldArray, useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import { Autocomplete, Button, EmptyState, ListBox, SearchField, useFilter } from '@heroui/react';

import { useGetUserTagsQuery } from '@/store/services/settings';
import type { UserTag } from '@/store/services/settings';

import type { OfferFormInput } from '../root-offer.form';

const USER_TAGS_PAGE = { page: 1, pageSize: 100 } as const;

export const RootOfferTagsField = ({ control }: { control: Control<OfferFormInput> }) => {
  const { contains } = useFilter({ sensitivity: 'base' });
  const { data: userTags } = useGetUserTagsQuery(USER_TAGS_PAGE);
  const { append, remove, update } = useFieldArray({ control, name: 'tags' });
  const tags = useWatch({ control, name: 'tags' }) ?? [];
  const catalog = userTags?.data ?? [];

  const selectedIds = tags.flatMap((tag) => tag.userTagIds);
  const available = catalog.filter((tag) => !selectedIds.includes(tag.id));

  const nameOf = (id: string) =>
    catalog.find((tag) => tag.id === id)?.name ??
    tags.find((tag) => tag.userTagIds.includes(id))?.name ??
    id;

  const addTag = (tag: UserTag) => {
    if (selectedIds.includes(tag.id)) return;

    append({ name: tag.name, active: true, userTagIds: [tag.id] });
  };

  const removeTag = (id: string) => {
    for (let index = tags.length - 1; index >= 0; index -= 1) {
      const current = tags[index];

      if (!current?.userTagIds.includes(id)) continue;

      const next = current.userTagIds.filter((entry) => entry !== id);

      if (next.length === 0) remove(index);
      else update(index, { ...current, userTagIds: next });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Autocomplete
        aria-label="Busque uma tag"
        className="w-full"
        onChange={(key) => {
          const id = typeof key === 'string' ? key : null;
          const tag = catalog.find((entry) => entry.id === id);

          if (tag) addTag(tag);
        }}
        placeholder="Busque uma tag"
        variant="secondary"
      >
        <Autocomplete.Trigger>
          <Autocomplete.Value />
          <Autocomplete.Indicator />
        </Autocomplete.Trigger>
        <Autocomplete.Popover>
          <Autocomplete.Filter filter={contains}>
            <SearchField aria-label="Buscar tag" autoFocus name="search" variant="secondary">
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder="Busque uma tag" />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
            <ListBox renderEmptyState={() => <EmptyState>Nenhuma tag encontrada</EmptyState>}>
              {available.map((tag) => (
                <ListBox.Item id={tag.id} key={tag.id} textValue={tag.name}>
                  {tag.name}
                  <span className="text-muted text-xs">
                    {tag.users} {tag.users === 1 ? 'pessoa' : 'pessoas'}
                  </span>
                </ListBox.Item>
              ))}
            </ListBox>
          </Autocomplete.Filter>
        </Autocomplete.Popover>
      </Autocomplete>

      <p className="text-muted text-xs">
        Selecione uma tag da lista. Tags novas nascem na tela de usuários.
      </p>

      {selectedIds.length > 0 ? (
        <div className="border-border flex flex-col gap-2 rounded-xl border px-3 py-2.5">
          <span className="text-muted text-xs">
            {selectedIds.length}{' '}
            {selectedIds.length === 1 ? 'tag selecionada' : 'tags selecionadas'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {selectedIds.map((id) => (
              <span
                className="bg-accent/10 text-accent flex items-center gap-1 rounded-full py-1 pr-1 pl-2.5 text-xs"
                key={id}
              >
                {nameOf(id)}
                <Button
                  aria-label={`Remover ${nameOf(id)}`}
                  isIconOnly
                  onPress={() => removeTag(id)}
                  size="sm"
                  variant="tertiary"
                >
                  <Xmark className="size-3.5" />
                </Button>
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
