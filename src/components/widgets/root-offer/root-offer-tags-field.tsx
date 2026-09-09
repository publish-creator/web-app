'use client';

import { TrashBin } from '@gravity-ui/icons';
import { Controller, useFieldArray } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import { Button, Description, Switch } from '@heroui/react';

import { TextField } from '@/components/composites';
import { useGetUserTagsQuery } from '@/store/services/settings';

import { RootOfferMultiSelect } from './root-offer-multi-select';
import type { OfferFormInput } from './root-offer.form';

const USER_TAGS_PAGE = { page: 1, pageSize: 100 } as const;

export const RootOfferTagsField = ({ control }: { control: Control<OfferFormInput> }) => {
  const { data: userTags } = useGetUserTagsQuery(USER_TAGS_PAGE);
  const { fields, append, remove } = useFieldArray({ control, name: 'tags' });

  const options = (userTags?.data ?? []).map((tag) => ({
    id: tag.id,
    name: `${tag.name} · ${tag.users} ${tag.users === 1 ? 'pessoa' : 'pessoas'}`,
  }));

  return (
    <div className="flex flex-col gap-3">
      {fields.map((entry, index) => (
        <div className="border-border flex flex-col gap-4 rounded-xl border p-4" key={entry.id}>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <Controller
                control={control}
                name={`tags.${index}.name`}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    errorMessage={fieldState.error?.message}
                    label="Nome da tag"
                    placeholder="Ex.: black-friday"
                    variant="secondary"
                  />
                )}
              />
            </div>

            <Button
              aria-label="Remover tag"
              className="mt-6"
              isIconOnly
              onPress={() => remove(index)}
              variant="tertiary"
            >
              <TrashBin className="size-4" />
            </Button>
          </div>

          <Controller
            control={control}
            name={`tags.${index}.userTagIds`}
            render={({ field }) => (
              <RootOfferMultiSelect
                label="Alcança quem carrega"
                onChange={field.onChange}
                options={options}
                placeholder="Nenhuma tag de usuário"
                value={field.value ?? []}
              />
            )}
          />

          <Controller
            control={control}
            name={`tags.${index}.active`}
            render={({ field }) => (
              <div className="flex items-start justify-between gap-6">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-sm font-medium">Ativa</span>
                  <p className="text-muted text-xs leading-snug">
                    Desligar corta o acesso de quem chegava por ela, sem desfazer as ligações.
                  </p>
                </div>
                <Switch
                  aria-label="Tag ativa"
                  isSelected={field.value ?? true}
                  onChange={field.onChange}
                >
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>
            )}
          />
        </div>
      ))}

      <div className="flex items-center gap-3">
        <Button
          onPress={() => append({ name: '', active: true, userTagIds: [] })}
          variant="secondary"
        >
          Adicionar tag
        </Button>
        {fields.length === 0 ? (
          <span className="text-muted text-sm">Nenhuma tag nesta oferta.</span>
        ) : null}
      </div>

      <Description className="text-xs">
        Uma tag ativa mostra a oferta para todo mundo que carrega a tag de usuário ligada a ela,
        agora e depois: quem for marcado amanhã vê amanhã, quem for desmarcado deixa de ver.
      </Description>
    </div>
  );
};
