'use client';

import { TrashBin } from '@gravity-ui/icons';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import { Button, Description, Switch } from '@heroui/react';

import { useGetUserTagsQuery } from '@/store/services/settings';

import { RootOfferMultiSelect } from './root-offer-multi-select';
import { RootOfferTagDialog } from './root-offer-tag-dialog';
import type { OfferFormInput } from './root-offer.form';

const USER_TAGS_PAGE = { page: 1, pageSize: 100 } as const;

export const RootOfferTagsField = ({ control }: { control: Control<OfferFormInput> }) => {
  const { data: userTags } = useGetUserTagsQuery(USER_TAGS_PAGE);
  const { fields, append, remove } = useFieldArray({ control, name: 'tags' });
  const tags = useWatch({ control, name: 'tags' }) ?? [];

  const options = (userTags?.data ?? []).map((tag) => ({
    id: tag.id,
    name: `${tag.name} · ${tag.users} ${tag.users === 1 ? 'pessoa' : 'pessoas'}`,
  }));

  const reach = (userTagIds: string[]) =>
    (userTags?.data ?? [])
      .filter((tag) => userTagIds.includes(tag.id))
      .reduce((total, tag) => total + tag.users, 0);

  return (
    <div className="flex flex-col gap-3">
      {fields.map((entry, index) => {
        const current = tags[index];
        const linked = current?.userTagIds ?? [];
        const people = reach(linked);

        return (
          <div className="border-border flex flex-col gap-4 rounded-xl border p-4" key={entry.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-sm font-semibold">{current?.name ?? ''}</span>
                <span className="text-muted text-xs">
                  {linked.length === 0
                    ? 'Sem tag de usuário ligada: não abre a oferta para ninguém.'
                    : `Alcança ${people} ${people === 1 ? 'pessoa' : 'pessoas'} hoje.`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name={`tags.${index}.active`}
                  render={({ field }) => (
                    <Switch
                      aria-label={`Tag ${current?.name ?? ''} ativa`}
                      isSelected={field.value ?? true}
                      onChange={field.onChange}
                    >
                      <Switch.Content>
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                      </Switch.Content>
                    </Switch>
                  )}
                />

                <Button
                  aria-label={`Remover ${current?.name ?? 'tag'}`}
                  isIconOnly
                  onPress={() => remove(index)}
                  variant="tertiary"
                >
                  <TrashBin className="size-4" />
                </Button>
              </div>
            </div>

            <Controller
              control={control}
              name={`tags.${index}.userTagIds`}
              render={({ field }) => (
                <RootOfferMultiSelect
                  label="Tags de usuário que ela alcança"
                  onChange={field.onChange}
                  options={options}
                  placeholder="Nenhuma tag de usuário"
                  value={field.value ?? []}
                />
              )}
            />
          </div>
        );
      })}

      <div className="flex items-center gap-3">
        <RootOfferTagDialog
          onAdd={(tag) => append(tag)}
          takenNames={tags.map((tag) => tag.name ?? '')}
        />
        {fields.length === 0 ? (
          <span className="text-muted text-sm">Nenhuma tag nesta oferta.</span>
        ) : null}
      </div>

      <Description className="text-xs">
        Desligar uma tag corta o acesso de quem chegava por ela sem desfazer as ligações. Quem for
        marcado com a tag amanhã vê a oferta amanhã.
      </Description>
    </div>
  );
};
