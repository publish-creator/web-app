'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useEffect } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { Button, ErrorMessage, Skeleton, Tabs } from '@heroui/react';

import { RootOfferCommissionTab } from '@/components/widgets/root-offer/root-offer-commission-tab';
import { RootOfferDetailsTab } from '@/components/widgets/root-offer/root-offer-details-tab';
import { RootOfferHeader } from '@/components/widgets/root-offer/root-offer-header';
import { RootOfferPendingTab } from '@/components/widgets/root-offer/root-offer-pending-tab';
import {
  formValuesFrom,
  offerFormSchema,
  updateBodyFrom,
} from '@/components/widgets/root-offer/root-offer.form';
import type { OfferFormInput } from '@/components/widgets/root-offer/root-offer.form';
import { OFFER_TABS, offerTabFrom } from '@/components/widgets/root-offer/root-offer.tabs';
import { useTabFilter } from '@/hooks/query/filters/use-tab-filter';
import { messageFromError } from '@/lib/api/error-message';
import { useGetOfferQuery, useUpdateOfferMutation } from '@/store/services/offers/offers.api';

const PENDING: Record<string, string> = {
  'buy-links': 'Os links de venda chegam na próxima fatia, com criar, editar e remover.',
  afiliados:
    'Depende da afiliação entrar na API: o interruptor de aprovação automática e a lista de quem se afiliou.',
  arquivos: 'Criativos, cópias e avatares dependem do subsistema de upload ligado nesta tela.',
  coprodutores: 'Quem divide a comissão chega junto com os buy links.',
};

export default function RootOfferDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const offerId = params?.id ?? '';

  const { tab, setTab } = useTabFilter({ defaultTab: 'detalhes' });
  const active = offerTabFrom(tab);

  const { data: offer, isLoading, isError } = useGetOfferQuery(offerId, { skip: !offerId });
  const [updateOffer, { isLoading: isSaving, error: saveError }] = useUpdateOfferMutation();

  const form = useForm<OfferFormInput>({ resolver: zodResolver(offerFormSchema) });

  useEffect(() => {
    if (offer) form.reset(formValuesFrom(offer));
  }, [form, offer]);

  if (isLoading) {
    return (
      <div className="container-wrapper">
        <Skeleton className="h-10 w-72 rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !offer) {
    return (
      <div className="container-wrapper">
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <p className="text-lg font-semibold">Oferta não encontrada</p>
          <p className="text-muted max-w-96 text-sm">
            Ela pode ter sido removida, ou o identificador na URL não corresponde a nenhuma.
          </p>
          <Button onPress={() => router.push('/root/offers')} variant="secondary">
            Voltar para as ofertas
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = form.handleSubmit(async (values) => {
    const parsed = offerFormSchema.parse(values);

    await updateOffer({ id: offer.id, body: updateBodyFrom(offer, parsed) }).unwrap();
    form.reset(values);
  });

  const isEditable = active === 'detalhes' || active === 'comissao';

  return (
    <form className="container-wrapper" onSubmit={(event) => void onSubmit(event)}>
      <RootOfferHeader offer={offer} />

      <Tabs
        onSelectionChange={(key) => setTab(String(key))}
        selectedKey={active}
        variant="secondary"
      >
        <Tabs.List>
          {OFFER_TABS.map((entry) => (
            <Tabs.Tab id={entry.id} key={entry.id}>
              {entry.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      {active === 'detalhes' ? <RootOfferDetailsTab control={form.control} /> : null}
      {active === 'comissao' ? <RootOfferCommissionTab control={form.control} /> : null}
      {!isEditable ? (
        <RootOfferPendingTab
          label={OFFER_TABS.find((entry) => entry.id === active)?.label ?? ''}
          note={PENDING[active] ?? ''}
        />
      ) : null}

      {saveError ? <ErrorMessage>{messageFromError(saveError)}</ErrorMessage> : null}

      {isEditable ? (
        <div className="flex items-center gap-3">
          <Button isDisabled={!form.formState.isDirty} isPending={isSaving} type="submit">
            Salvar
          </Button>
          {form.formState.isDirty ? (
            <span className="text-muted text-sm">Há alterações não salvas.</span>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
