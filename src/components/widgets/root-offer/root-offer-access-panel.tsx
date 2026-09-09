'use client';

import { Controller, useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import { Card } from '@heroui/react';

import { RootOfferChoice } from './root-offer-choice';
import { RootOfferTagsField } from './root-offer-tags-field';
import { RootOfferUsersField } from './root-offer-users-field';
import type { OfferFormInput } from './root-offer.form';

const AUDIENCE = [
  {
    id: 'all',
    label: 'Aberta para todos',
    hint: 'Qualquer afiliado enxerga a oferta enquanto ela estiver publicada.',
  },
  {
    id: 'selected',
    label: 'Só quem eu escolher',
    hint: 'Vale para os usuários e as tags listados abaixo. Mais ninguém vê.',
  },
] as const;

const AFFILIATION = [
  {
    id: 'automatic',
    label: 'Aprovar na hora',
    hint: 'O pedido já sai aprovado, com a comissão que a oferta tem hoje.',
  },
  {
    id: 'manual',
    label: 'Revisar antes',
    hint: 'O pedido fica pendente até alguém decidir, e a comissão pode mudar na decisão.',
  },
] as const;

const Block = ({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-3">
    <div className="flex items-start gap-3">
      <span className="bg-surface-secondary text-muted flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
        {step}
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-muted text-xs">{description}</span>
      </div>
    </div>
    <div className="flex flex-col gap-4 sm:pl-9">{children}</div>
  </section>
);

export const RootOfferAccessPanel = ({ control }: { control: Control<OfferFormInput> }) => {
  const isOpen = useWatch({ control, name: 'isAvailableForAllUsers' }) ?? false;
  const isAutomatic = useWatch({ control, name: 'allowsAutomaticAffiliation' }) ?? false;
  const userIds = useWatch({ control, name: 'allowedUserIds' }) ?? [];
  const tags = useWatch({ control, name: 'tags' }) ?? [];

  const activeTags = tags.filter((tag) => tag.active).length;

  return (
    <Card>
      <Card.Header>
        <Card.Title className="text-base">Acesso e afiliação</Card.Title>
        <Card.Description>
          {isOpen
            ? 'Hoje: qualquer afiliado vê a oferta'
            : `Hoje: ${userIds.length} ${userIds.length === 1 ? 'usuário' : 'usuários'} e ${activeTags} ${activeTags === 1 ? 'tag ativa' : 'tags ativas'} alcançam a oferta`}
          {isAutomatic ? ' · afiliação aprovada na hora' : ' · afiliação revisada antes'}
        </Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col gap-8">
        <Block
          description="Publicar não basta: a oferta só aparece para quem passa por uma destas portas."
          step="1"
          title="Quem enxerga a oferta"
        >
          <Controller
            control={control}
            name="isAvailableForAllUsers"
            render={({ field }) => (
              <RootOfferChoice
                label="Quem enxerga a oferta"
                onChange={(id) => field.onChange(id === 'all')}
                options={AUDIENCE}
                value={field.value ? 'all' : 'selected'}
              />
            )}
          />

          {isOpen ? null : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium">Usuários escolhidos um a um</span>
                <Controller
                  control={control}
                  name="allowedUserIds"
                  render={({ field }) => (
                    <RootOfferUsersField onChange={field.onChange} value={field.value ?? []} />
                  )}
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium">Tags que abrem a oferta</span>
                <RootOfferTagsField control={control} />
              </div>
            </div>
          )}
        </Block>

        <Block
          description="Vale para todo mundo que alcança a oferta, inclusive quem chegou por tag."
          step="2"
          title="Quando alguém pede para se afiliar"
        >
          <Controller
            control={control}
            name="allowsAutomaticAffiliation"
            render={({ field }) => (
              <RootOfferChoice
                label="Quando alguém pede para se afiliar"
                onChange={(id) => field.onChange(id === 'automatic')}
                options={AFFILIATION}
                value={field.value ? 'automatic' : 'manual'}
              />
            )}
          />
        </Block>
      </Card.Content>
    </Card>
  );
};
