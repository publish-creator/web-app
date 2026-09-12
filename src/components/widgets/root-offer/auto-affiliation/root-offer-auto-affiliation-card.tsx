'use client';

import { Pencil, Person, TrashBin } from '@gravity-ui/icons';

import { useState } from 'react';

import { Button, Chip, Switch } from '@heroui/react';

import {
  JOB_STATUS_LABEL,
  applyToMeta,
  formatCommissionAmount,
} from './root-offer-auto-affiliation.form';
import type { AutomaticAffiliationRule } from './root-offer-auto-affiliation.form';

interface RootOfferAutoAffiliationCardProps {
  rule: AutomaticAffiliationRule;
  names: Map<string, string>;
  currency: string | null;
  busy: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onToggle: (enabled: boolean) => void;
  onAffiliate: () => void;
  onUnaffiliate: () => void;
}

export const RootOfferAutoAffiliationCard = ({
  rule,
  names,
  currency,
  busy,
  onEdit,
  onRemove,
  onToggle,
  onAffiliate,
  onUnaffiliate,
}: RootOfferAutoAffiliationCardProps) => {
  const [confirmUnaffiliate, setConfirmUnaffiliate] = useState(false);
  const meta = applyToMeta(rule.applyTo);

  return (
    <article className="border-border flex flex-col gap-3 rounded-2xl border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip size="sm" variant="secondary">
            {meta.label}
          </Chip>
          <Chip size="sm" variant={rule.jobStatus === 'IN_PROGRESS' ? 'soft' : 'secondary'}>
            {JOB_STATUS_LABEL[rule.jobStatus]}
          </Chip>
          {rule.userTagIds.map((id) => (
            <Chip key={id} size="sm" variant="soft">
              {names.get(id) ?? 'tag'}
            </Chip>
          ))}
        </div>

        <Switch isDisabled={busy} isSelected={rule.enabled} onChange={onToggle}>
          <Switch.Content>
            <span className="text-muted pr-2 text-xs">{rule.enabled ? 'Ligada' : 'Desligada'}</span>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Content>
        </Switch>
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

      <div className="flex flex-wrap items-center justify-end gap-1">
        {confirmUnaffiliate ? (
          <>
            <p className="text-muted mr-auto text-xs">
              Cancela quem ainda tem a etiqueta. A regra continua.
            </p>
            <Button onPress={() => setConfirmUnaffiliate(false)} size="sm" variant="tertiary">
              Voltar
            </Button>
            <Button
              className="text-danger"
              isPending={busy}
              onPress={() => {
                setConfirmUnaffiliate(false);
                onUnaffiliate();
              }}
              size="sm"
              variant="tertiary"
            >
              Desafiliar
            </Button>
          </>
        ) : (
          <>
            <Button isDisabled={busy} onPress={onAffiliate} size="sm" variant="tertiary">
              <Person className="size-4" />
              Afiliar
            </Button>
            <Button
              className="text-danger"
              isDisabled={busy}
              onPress={() => setConfirmUnaffiliate(true)}
              size="sm"
              variant="tertiary"
            >
              Desafiliar
            </Button>
            <Button onPress={onEdit} size="sm" variant="tertiary">
              <Pencil className="size-4" />
              Editar
            </Button>
            <Button className="text-danger" onPress={onRemove} size="sm" variant="tertiary">
              <TrashBin className="size-4" />
              Remover
            </Button>
          </>
        )}
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
