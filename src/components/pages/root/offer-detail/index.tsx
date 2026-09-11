'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';

import { useEffect } from 'react';
import type { FormEvent } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { Button, ErrorMessage, Skeleton, Tabs } from '@heroui/react';

import { useTabFilter } from '@/hooks/query/filters/use-tab-filter';
import { messageFromError } from '@/lib/api/error-message';
import { useGetOfferQuery, useUpdateOfferMutation } from '@/store/services/offers/offers.api';
import type { Offer } from '@/store/services/offers/offers.types';
import {
  OFFER_TABS,
  RootOfferAffiliateAssign,
  RootOfferAuditTab,
  RootOfferAutoAffiliationTab,
  RootOfferBuyLinksTab,
  RootOfferCommissionTab,
  RootOfferDetailsTab,
  RootOfferHeader,
  RootOfferPendingTab,
  formValuesFrom,
  offerFormSchema,
  offerTabFrom,
  updateBodyFrom,
} from '@/widgets/root-offer';
import type { OfferFormInput, OfferTab } from '@/widgets/root-offer';

const PENDING: Record<string, string> = {
  arquivos: 'Criativos, cópias e avatares dependem do subsistema de upload ligado nesta tela.',
  coprodutores: 'Quem divide a comissão chega junto com os buy links.',
};

export function RootOfferDetailPage() {
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

  if (isLoading) return <OfferDetailLoading />;

  if (isError || !offer) {
    return <OfferDetailMissing onBack={() => router.push('/root/offers')} />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    const parsed = offerFormSchema.parse(values);

    await updateOffer({ id: offer.id, body: updateBodyFrom(offer, parsed) }).unwrap();
    form.reset(values);
  });

  return (
    <div className="container-wrapper gap-5">
      <RootOfferHeader actions={<RootOfferAffiliateAssign offerId={offer.id} />} offer={offer} />

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

      <OfferDetailPanels
        active={active}
        form={form}
        isSaving={isSaving}
        offer={offer}
        onSubmit={onSubmit}
        saveError={saveError}
      />
    </div>
  );
}

const OfferDetailPanels = ({
  active,
  form,
  isSaving,
  offer,
  onSubmit,
  saveError,
}: {
  active: OfferTab;
  form: UseFormReturn<OfferFormInput>;
  isSaving: boolean;
  offer: Offer;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  saveError: unknown;
}) => {
  const isEditable = active === 'detalhes' || active === 'comissao';

  if (isEditable) {
    return (
      <form className="flex flex-col gap-5" onSubmit={(event) => void onSubmit(event)}>
        {active === 'detalhes' ? <RootOfferDetailsTab control={form.control} /> : null}
        {active === 'comissao' ? <RootOfferCommissionTab control={form.control} /> : null}

        {saveError ? <ErrorMessage>{messageFromError(saveError)}</ErrorMessage> : null}

        <div className="bg-background/90 sticky bottom-0 z-10 flex items-center gap-3 border-t py-3 backdrop-blur-sm">
          <Button isDisabled={!form.formState.isDirty} isPending={isSaving} type="submit">
            Salvar
          </Button>
          {form.formState.isDirty ? (
            <span className="text-muted text-sm">Alterações não salvas</span>
          ) : null}
        </div>
      </form>
    );
  }

  if (active === 'afiliacao-automatica') return <RootOfferAutoAffiliationTab offer={offer} />;
  if (active === 'buy-links') return <RootOfferBuyLinksTab offer={offer} />;
  if (active === 'auditoria') return <RootOfferAuditTab offerId={offer.id} />;

  return (
    <RootOfferPendingTab
      label={OFFER_TABS.find((entry) => entry.id === active)?.label ?? ''}
      note={PENDING[active] ?? ''}
    />
  );
};

const OfferDetailLoading = () => (
  <div className="container-wrapper">
    <Skeleton className="h-10 w-72 rounded-xl" />
    <Skeleton className="h-10 w-full rounded-xl" />
    <Skeleton className="h-96 w-full rounded-2xl" />
  </div>
);

const OfferDetailMissing = ({ onBack }: { onBack: () => void }) => (
  <div className="container-wrapper">
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <p className="text-lg font-semibold">Oferta não encontrada</p>
      <p className="text-muted max-w-96 text-sm">
        Ela pode ter sido removida, ou o identificador na URL não corresponde a nenhuma.
      </p>
      <Button onPress={onBack} variant="secondary">
        Voltar para as ofertas
      </Button>
    </div>
  </div>
);
