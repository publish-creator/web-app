'use client';

import { Pencil, Plus, TrashBin } from '@gravity-ui/icons';

import { useMemo, useState } from 'react';

import { Button, Chip, ListBox, Select } from '@heroui/react';

import type { AutomaticAffiliation } from '@/store/services/offers/offer-details.types';
import {
  useCreateAutomaticAffiliationMutation,
  useDeleteAutomaticAffiliationMutation,
  useGetAutomaticAffiliationsQuery,
  useUpdateAutomaticAffiliationMutation,
} from '@/store/services/offers/offers.api';
import type { Offer } from '@/store/services/offers/offers.types';
import { useGetUserTagsQuery } from '@/store/services/settings';

import { RootOfferAutoAffiliationDialog } from './root-offer-auto-affiliation-dialog';
import {
  APPLY_TO,
  MAX_RULES_PER_OFFER,
  applyToMeta,
  formatCommissionAmount,
} from './root-offer-auto-affiliation.form';
import type {
  AutomaticAffiliationCreateBody,
  AutomaticAffiliationRule,
} from './root-offer-auto-affiliation.form';

const PAGE = { page: 1, pageSize: 100 } as const;
const FILTER_ALL = 'ALL';

const toRule = (row: AutomaticAffiliation): AutomaticAffiliationRule => ({
  id: row.id,
  userTagIds: row.userTags.map((tag) => tag.id),
  applyTo: row.applyTo,
  sameAsFront: false,
  frontCommissionType: row.frontCommissionType,
  frontCommissionValue: Number(row.frontCommissionValue),
  backCommissionType: row.backCommissionType,
  backCommissionValue: Number(row.backCommissionValue),
  recurrenceCommissionType: row.recurrenceCommissionType,
  recurrenceCommissionValue: Number(row.recurrenceCommissionValue),
  updatedAt: row.updatedAt,
});

interface RootOfferAutoAffiliationTabProps {
  offer: Offer;
}

export const RootOfferAutoAffiliationTab = ({ offer }: RootOfferAutoAffiliationTabProps) => {
  const { data: userTags } = useGetUserTagsQuery(PAGE);
  const [applyFilter, setApplyFilter] = useState<string>(FILTER_ALL);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<AutomaticAffiliationRule | null>(null);

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

  const rules = (data?.data ?? []).map(toRule);
  const names = useMemo(() => {
    const map = new Map((userTags?.data ?? []).map((tag) => [tag.id, tag.name]));

    for (const row of data?.data ?? []) {
      for (const tag of row.userTags) map.set(tag.id, tag.name);
    }

    return map;
  }, [userTags, data]);

  const atLimit = (data?.meta.total ?? rules.length) >= MAX_RULES_PER_OFFER;

  const openCreate = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const openEdit = (rule: AutomaticAffiliationRule) => {
    setEditing(rule);
    setIsOpen(true);
  };

  const saveRule = async (body: AutomaticAffiliationCreateBody) => {
    if (editing) {
      await updateRule({ offerId: offer.id, id: editing.id, body }).unwrap();
      return;
    }

    await createRule({ offerId: offer.id, body }).unwrap();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted max-w-lg text-sm">
          Pedido com uma destas tags entra aprovado, com a comissão da regra.
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

          <Button isDisabled={atLimit} onPress={openCreate}>
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
            <RuleCard
              currency={offer.currency}
              key={rule.id}
              names={names}
              onEdit={() => openEdit(rule)}
              onRemove={() => void deleteRule({ offerId: offer.id, id: rule.id })}
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

const RuleCard = ({
  rule,
  names,
  currency,
  onEdit,
  onRemove,
}: {
  rule: AutomaticAffiliationRule;
  names: Map<string, string>;
  currency: string | null;
  onEdit: () => void;
  onRemove: () => void;
}) => {
  const meta = applyToMeta(rule.applyTo);

  return (
    <article className="border-border flex flex-col gap-3 rounded-2xl border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip size="sm" variant="secondary">
            {meta.label}
          </Chip>
          {rule.userTagIds.map((id) => (
            <Chip key={id} size="sm" variant="soft">
              {names.get(id) ?? 'tag'}
            </Chip>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button onPress={onEdit} size="sm" variant="tertiary">
            <Pencil className="size-4" />
            Editar
          </Button>
          <Button className="text-danger" onPress={onRemove} size="sm" variant="tertiary">
            <TrashBin className="size-4" />
            Remover
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <CommissionCell
          currency={currency}
          label="FRONT"
          type={rule.frontCommissionType}
          value={rule.frontCommissionValue}
        />
        <CommissionCell
          currency={currency}
          label="BACK"
          type={rule.backCommissionType}
          value={rule.backCommissionValue}
        />
        <CommissionCell
          currency={currency}
          label="REC."
          type={rule.recurrenceCommissionType}
          value={rule.recurrenceCommissionValue}
        />
      </div>
    </article>
  );
};

const CommissionCell = ({
  label,
  type,
  value,
  currency,
}: {
  label: string;
  type: AutomaticAffiliationRule['frontCommissionType'];
  value: number;
  currency: string | null;
}) => (
  <div className="bg-surface-secondary flex items-center justify-between rounded-xl px-3 py-2">
    <div className="flex flex-col">
      <span className="text-muted text-[11px] font-semibold tracking-wide">{label}</span>
      <span className="text-sm font-semibold">{formatCommissionAmount(type, value, currency)}</span>
    </div>
    <Chip color="success" size="sm" variant="soft">
      {type === 'REV_SHARE' ? 'REV' : 'CPA'}
    </Chip>
  </div>
);
