'use client';

import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import { TextArea, ToggleButton, ToggleButtonGroup } from '@heroui/react';

import { TextField } from '@/components/composites';
import { useGetOffersCategoriesQuery } from '@/store/services/offers-category/offers-category.api';
import { useGetNichesQuery, useGetStructuresQuery } from '@/store/services/taxonomies';

import { RootOfferTaxonomySelect } from './root-offer-taxonomy-select';
import type { OfferFormInput } from './root-offer.form';

const STATUS_OPTIONS = [
  { id: 'DRAFT', label: 'Rascunho' },
  { id: 'PUBLISHED', label: 'Publicada' },
  { id: 'INACTIVE', label: 'Inativa' },
] as const;

const toggleClass =
  'rounded-full bg-transparent text-muted data-[selected=true]:bg-surface-secondary data-[selected=true]:text-foreground';

const TAXONOMY_PAGE = { page: 1, pageSize: 100 } as const;

export const RootOfferDetailsTab = ({ control }: { control: Control<OfferFormInput> }) => {
  const { data: categories } = useGetOffersCategoriesQuery(TAXONOMY_PAGE);
  const { data: niches } = useGetNichesQuery(TAXONOMY_PAGE);
  const { data: structures } = useGetStructuresQuery(TAXONOMY_PAGE);

  const options = (rows: { id: string; name: string }[] | undefined) => rows ?? [];

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold">Identificação</h2>

        <Controller
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              errorMessage={fieldState.error?.message}
              label="Título"
              placeholder="Nome da oferta"
              variant="secondary"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <span className="text-muted text-xs font-medium">Descrição</span>
              <TextArea
                onChange={field.onChange}
                placeholder="O que a oferta é"
                rows={4}
                value={field.value ?? ''}
                variant="secondary"
              />
            </div>
          )}
        />

        <Controller
          control={control}
          name="angle"
          render={({ field }) => (
            <TextField
              {...field}
              label="Ângulo"
              placeholder="O ângulo de comunicação"
              value={field.value ?? ''}
              variant="secondary"
            />
          )}
        />

        <Controller
          control={control}
          name="imageUrl"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              errorMessage={fieldState.error?.message}
              label="Imagem (URL)"
              placeholder="https://..."
              value={field.value ?? ''}
              variant="secondary"
            />
          )}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold">Classificação</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <Controller
            control={control}
            name="categoryId"
            render={({ field, fieldState }) => (
              <RootOfferTaxonomySelect
                isInvalid={Boolean(fieldState.error)}
                label="Categoria"
                onChange={(id) => field.onChange(id ?? '')}
                options={options(categories?.data)}
                value={field.value}
              />
            )}
          />

          <Controller
            control={control}
            name="nicheId"
            render={({ field }) => (
              <RootOfferTaxonomySelect
                allowEmpty
                label="Nicho"
                onChange={field.onChange}
                options={options(niches?.data)}
                value={field.value}
              />
            )}
          />

          <Controller
            control={control}
            name="structureId"
            render={({ field }) => (
              <RootOfferTaxonomySelect
                allowEmpty
                label="Estrutura"
                onChange={field.onChange}
                options={options(structures?.data)}
                value={field.value}
              />
            )}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold">Destino e publicação</h2>

        <Controller
          control={control}
          name="pvUrl"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              errorMessage={fieldState.error?.message}
              label="Página de vendas"
              placeholder="https://..."
              value={field.value ?? ''}
              variant="secondary"
            />
          )}
        />

        <Controller
          control={control}
          name="currency"
          render={({ field }) => (
            <TextField
              {...field}
              label="Moeda"
              placeholder="BRL"
              value={field.value ?? ''}
              variant="secondary"
            />
          )}
        />

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <span className="text-muted text-xs font-medium">Status</span>
              <ToggleButtonGroup
                aria-label="Status da oferta"
                className="flex flex-wrap gap-1"
                onSelectionChange={(keys) => {
                  const [first] = [...keys];

                  if (typeof first === 'string') field.onChange(first);
                }}
                selectedKeys={new Set([field.value])}
                selectionMode="single"
              >
                {STATUS_OPTIONS.map((option) => (
                  <ToggleButton className={toggleClass} id={option.id} key={option.id}>
                    {option.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </div>
          )}
        />
      </section>
    </div>
  );
};
