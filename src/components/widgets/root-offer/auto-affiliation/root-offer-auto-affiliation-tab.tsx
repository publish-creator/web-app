'use client';

import { Plus } from '@gravity-ui/icons';

import { useMemo, useState } from 'react';

import { Button, ListBox, Select } from '@heroui/react';

import type { AutomaticAffiliationWriteBody } from '@/store/services/offers/offer-details.types';
import {
  useCreateAutomaticAffiliationMutation,
  useDeleteAutomaticAffiliationMutation,
  useExecuteAutomaticAffiliationMutation,
  useGetAutomaticAffiliationsQuery,
  useUpdateAutomaticAffiliationMutation,
} from '@/store/services/offers/offers.api';
import type { Offer } from '@/store/services/offers/offers.types';
import { useGetUserTagsQuery } from '@/store/services/settings';

import { RootOfferAutoAffiliationCard } from './root-offer-auto-affiliation-card';
import { RootOfferAutoAffiliationDialog } from './root-offer-auto-affiliation-dialog';
import {
  APPLY_TO,
  MAX_RULES_PER_OFFER,
  applyToMeta,
  toRule,
} from './root-offer-auto-affiliation.form';
import type { AutomaticAffiliationRule } from './root-offer-auto-affiliation.form';

const PAGE = { page: 1, pageSize: 100 } as const;
const FILTER_ALL = 'ALL';

interface RootOfferAutoAffiliationTabProps {
  offer: Offer;
}

export const RootOfferAutoAffiliationTab = ({ offer }: RootOfferAutoAffiliationTabProps) => {
  const { data: userTags } = useGetUserTagsQuery(PAGE);
  const [applyFilter, setApplyFilter] = useState<string>(FILTER_ALL);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<AutomaticAffiliationRule | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const listArgs = {
    offerId: offer.id,
    page: 1,
    pageSize: 100,
    ...(applyFilter === FILTER_ALL ? {} : { applyTo: applyFilter }),
  };

  const { data } = useGetAutomaticAffiliationsQuery(listArgs);
  const [createRule] = useCreateAutomaticAffiliationMutation();
  const [updateRule] = useUpdateAutomaticAffiliationMutation();
  const [deleteRule] = useDeleteAutomaticAffiliationMutation();
  const [executeRule] = useExecuteAutomaticAffiliationMutation();

  const rules = (data?.data ?? []).map(toRule);
  const names = useMemo(() => {
    const map = new Map((userTags?.data ?? []).map((tag) => [tag.id, tag.name]));

    for (const row of data?.data ?? []) {
      for (const tag of row.userTags) map.set(tag.id, tag.name);
    }

    return map;
  }, [userTags, data]);

  const atLimit = (data?.meta.total ?? rules.length) >= MAX_RULES_PER_OFFER;

  const run = async (id: string, work: () => Promise<unknown>) => {
    setBusyId(id);
    try {
      await work();
    } finally {
      setBusyId(null);
    }
  };

  const saveRule = async (body: AutomaticAffiliationWriteBody) => {
    if (editing) {
      await updateRule({ offerId: offer.id, id: editing.id, body }).unwrap();
      return;
    }

    await createRule({ offerId: offer.id, body }).unwrap();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted max-w-xl text-sm">
          Quem tem a etiqueta entra na oferta com a comissão da regra. Salvar antigos ou todos
          afilia na hora se a oferta estiver no ar. Desafiliar tira a pessoa; a regra continua.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            aria-label="Filtrar por alcance"
            className="w-44"
            onChange={(next) => {
              if (next != null) setApplyFilter(String(next));
            }}
            value={applyFilter}
            variant="secondary"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id={FILTER_ALL} textValue="Todos">
                  Todos
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                {APPLY_TO.map((id) => (
                  <ListBox.Item id={id} key={id} textValue={applyToMeta(id).label}>
                    {applyToMeta(id).label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <Button
            isDisabled={atLimit}
            onPress={() => {
              setEditing(null);
              setIsOpen(true);
            }}
          >
            <Plus className="size-4" />
            Nova regra
          </Button>
        </div>
      </div>

      {rules.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-2xl border border-dashed py-16 text-center">
          <p className="text-muted text-sm">Nenhuma regra neste filtro.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rules.map((rule) => (
            <RootOfferAutoAffiliationCard
              busy={busyId === rule.id}
              currency={offer.currency}
              key={rule.id}
              names={names}
              onAffiliate={() =>
                void run(rule.id, () =>
                  executeRule({ offerId: offer.id, id: rule.id, action: 'AFFILIATE' }).unwrap(),
                )
              }
              onEdit={() => {
                setEditing(rule);
                setIsOpen(true);
              }}
              onRemove={() => void deleteRule({ offerId: offer.id, id: rule.id })}
              onToggle={(enabled) =>
                void run(rule.id, () =>
                  updateRule({ offerId: offer.id, id: rule.id, body: { enabled } }).unwrap(),
                )
              }
              onUnaffiliate={() =>
                void run(rule.id, () =>
                  executeRule({ offerId: offer.id, id: rule.id, action: 'UNAFFILIATE' }).unwrap(),
                )
              }
              rule={rule}
            />
          ))}
        </div>
      )}

      <RootOfferAutoAffiliationDialog
        editing={editing}
        isOpen={isOpen}
        offerCode={offer.code}
        offerTitle={offer.title}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setEditing(null);
        }}
        onSubmitRule={saveRule}
      />
    </div>
  );
};
