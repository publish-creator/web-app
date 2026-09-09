'use client';

import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import { Card, Description, TextArea } from '@heroui/react';

import { TextField } from '@/components/composites';
import { useGetOffersCategoriesQuery } from '@/store/services/offers-category/offers-category.api';
import { useGetNichesQuery, useGetStructuresQuery } from '@/store/services/taxonomies';

import { RootOfferCoverField } from './root-offer-cover-field';
import { RootOfferStatusField } from './root-offer-status-field';
import { RootOfferTaxonomySelect } from './root-offer-taxonomy-select';
import type { OfferFormInput } from './root-offer.form';

const TAXONOMY_PAGE = { page: 1, pageSize: 100 } as const;

const PAYMENT_PLATFORMS = [
  { id: 'SPARK', name: 'Spark' },
  { id: 'BUY_GOODS', name: 'Buy Goods' },
];

const FIELD_LABEL = 'text-muted text-xs font-medium';

const Panel = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <Card>
    <Card.Header>
      <Card.Title className="text-base">{title}</Card.Title>
      <Card.Description>{description}</Card.Description>
    </Card.Header>
    <Card.Content className="flex flex-col gap-5">{children}</Card.Content>
  </Card>
);

export const RootOfferDetailsTab = ({ control }: { control: Control<OfferFormInput> }) => {
  const { data: categories } = useGetOffersCategoriesQuery(TAXONOMY_PAGE);
  const { data: niches } = useGetNichesQuery(TAXONOMY_PAGE);
  const { data: structures } = useGetStructuresQuery(TAXONOMY_PAGE);

  const options = (rows: { id: string; name: string }[] | undefined) => rows ?? [];

  return (
    <div className="flex flex-col gap-4">
      <Panel
        description="A capa e o texto que o afiliado vê antes de decidir."
        title="Identificação"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <Controller
            control={control}
            name="imageUrl"
            render={({ field, fieldState }) => (
              <RootOfferCoverField
                errorMessage={fieldState.error?.message}
                onChange={field.onChange}
                value={field.value ?? ''}
              />
            )}
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
                    O enquadramento da comunicação. Texto livre.
                  </Description>
                </div>
              )}
            />
          </div>
        </div>
      </Panel>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <Panel
          description="Onde a oferta aparece nos filtros e nas buscas do afiliado."
          title="Classificação"
        >
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

          <Description className="text-xs">
            Só a categoria é obrigatória. Nicho e estrutura podem ficar vazios.
          </Description>
        </Panel>

        <Panel
          description="Como a oferta cobra, e quem consegue enxergar ela hoje."
          title="Comercial e publicação"
        >
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
                <TextField
                  {...field}
                  label="Moeda"
                  placeholder="BRL"
                  value={field.value ?? ''}
                  variant="secondary"
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name="status"
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <span className={FIELD_LABEL}>Status</span>
                <RootOfferStatusField onChange={field.onChange} value={field.value} />
                {fieldState.error ? (
                  <span className="text-danger text-xs">{fieldState.error.message}</span>
                ) : null}
              </div>
            )}
          />
        </Panel>
      </div>
    </div>
  );
};
