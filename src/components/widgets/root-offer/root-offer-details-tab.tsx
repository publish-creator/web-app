'use client';

import { Controller, useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import { Description, TextArea } from '@heroui/react';

import { TextField } from '@/components/composites';
import { useGetOffersCategoriesQuery } from '@/store/services/offers-category/offers-category.api';
import { useGetNichesQuery, useGetStructuresQuery } from '@/store/services/taxonomies';

import {
  RootOfferAccessPanel,
  RootOfferCountriesField,
  RootOfferCoverField,
  RootOfferPanel,
  RootOfferTaxonomySelect,
} from './fields';
import type { OfferFormInput } from './root-offer.form';

const TAXONOMY_PAGE = { page: 1, pageSize: 100 } as const;

const STATUS_OPTIONS = [
  { id: 'DRAFT', name: 'Rascunho' },
  { id: 'PUBLISHED', name: 'Publicada' },
  { id: 'INACTIVE', name: 'Inativa' },
];

const CURRENCY_CODES = ['BRL', 'USD', 'EUR', 'GBP', 'MXN', 'ARS', 'COP', 'CLP', 'PEN'];

function currencyOptions(current: string | null | undefined) {
  const codes =
    current && !CURRENCY_CODES.includes(current) ? [current, ...CURRENCY_CODES] : CURRENCY_CODES;

  return codes.map((code) => ({ id: code, name: code }));
}

const PAYMENT_PLATFORMS = [
  { id: 'SPARK', name: 'Spark' },
  { id: 'BUY_GOODS', name: 'Buy Goods' },
];

const FIELD_LABEL = 'text-muted text-xs font-medium';

export const RootOfferDetailsTab = ({ control }: { control: Control<OfferFormInput> }) => {
  const { data: categories } = useGetOffersCategoriesQuery(TAXONOMY_PAGE);
  const { data: niches } = useGetNichesQuery(TAXONOMY_PAGE);
  const { data: structures } = useGetStructuresQuery(TAXONOMY_PAGE);

  const countries = useWatch({ control, name: 'countries' }) ?? [];
  const currency = useWatch({ control, name: 'currency' });
  const countryGroupIds = useWatch({ control, name: 'countryGroupIds' }) ?? [];

  const options = (rows: { id: string; name: string }[] | undefined) => rows ?? [];

  return (
    <div className="flex flex-col gap-4">
      <RootOfferPanel description="O que o afiliado vê antes de pedir acesso." title="Oferta">
        <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <Controller
            control={control}
            name="imageUrl"
            render={({ field }) => <RootOfferCoverField value={field.value ?? ''} />}
          />

          <div className="flex flex-col gap-5">
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
                  <span className={FIELD_LABEL}>Descrição</span>
                  <TextArea
                    onChange={field.onChange}
                    placeholder="O que a oferta vende, em poucas linhas"
                    rows={5}
                    value={field.value ?? ''}
                    variant="secondary"
                  />
                  <Description className="text-xs">
                    Aparece na tela do afiliado, abaixo do título.
                  </Description>
                </div>
              )}
            />

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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

              <Controller
                control={control}
                name="status"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1.5">
                    <RootOfferTaxonomySelect
                      isInvalid={Boolean(fieldState.error)}
                      label="Status"
                      onChange={(id) => field.onChange(id ?? 'DRAFT')}
                      options={STATUS_OPTIONS}
                      value={field.value}
                    />
                    {fieldState.error ? (
                      <span className="text-danger text-xs">{fieldState.error.message}</span>
                    ) : null}
                  </div>
                )}
              />
            </div>

            <Description className="text-xs">
              Rascunho só para admin. Publicada para quem alcança. Inativa some da lista.
            </Description>
          </div>
        </div>
      </RootOfferPanel>

      <RootOfferPanel description="Pagamento, moeda e países." title="Comercial">
        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            control={control}
            name="paymentPlatform"
            render={({ field }) => (
              <RootOfferTaxonomySelect
                label="Plataforma de pagamento"
                onChange={(id) => field.onChange(id ?? 'SPARK')}
                options={PAYMENT_PLATFORMS}
                value={field.value}
              />
            )}
          />

          <Controller
            control={control}
            name="currency"
            render={({ field }) => (
              <RootOfferTaxonomySelect
                allowEmpty
                label="Moeda"
                onChange={field.onChange}
                options={currencyOptions(currency)}
                value={field.value ?? null}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="angle"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <TextField
                {...field}
                label="Ângulo"
                placeholder="Ex.: emagrecimento sem dieta"
                value={field.value ?? ''}
                variant="secondary"
              />
              <Description className="text-xs">
                Discurso da comunicação, em texto livre.
              </Description>
            </div>
          )}
        />

        <div className="border-border border-t pt-5">
          <Controller
            control={control}
            name="countries"
            render={({ field: countriesField }) => (
              <Controller
                control={control}
                name="countryGroupIds"
                render={({ field: groupsField }) => (
                  <RootOfferCountriesField
                    countries={countries}
                    countryGroupIds={countryGroupIds}
                    onCountriesChange={countriesField.onChange}
                    onGroupsChange={groupsField.onChange}
                  />
                )}
              />
            )}
          />
        </div>
      </RootOfferPanel>

      <RootOfferAccessPanel control={control} />
    </div>
  );
};
