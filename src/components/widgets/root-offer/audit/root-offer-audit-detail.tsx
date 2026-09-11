'use client';

import { Copy } from '@gravity-ui/icons';
import { AltArrowLeftIcon } from '@solar-icons/react/linear';

import { useState } from 'react';

import { Button, Chip } from '@heroui/react';

import type { OfferAuditEntry } from '@/store/services/offers/offer-details.types';
import type { Offer } from '@/store/services/offers/offers.types';

import { RootOfferAuditDiff } from './root-offer-audit-diff';
import { AUDIT_ACTION_META, AUDIT_ENTITY_LABEL } from './root-offer-audit.labels';

interface Props {
  entry: OfferAuditEntry;
  offer?: Offer | null;
  onBack: () => void;
}

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <dt className="text-muted text-[11px] tracking-wide uppercase">{label}</dt>
    <dd className="text-foreground mt-0.5 text-sm break-all">{value || '—'}</dd>
  </div>
);

const CopyRow = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="bg-surface-secondary flex min-w-0 items-center gap-2 rounded-xl px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="text-muted text-[10px] tracking-wide uppercase">{label}</p>
        <p className="truncate font-mono text-xs">{value || '—'}</p>
      </div>
      {value ? (
        <Button onPress={() => void copy()} size="sm" variant="tertiary">
          <Copy className="size-4" />
          {copied ? 'Copiado' : 'Copiar'}
        </Button>
      ) : null}
    </div>
  );
};

export const RootOfferAuditDetail = ({ entry, offer, onBack }: Props) => {
  const action = AUDIT_ACTION_META[entry.action];
  const who = entry.changedBy;
  const when = new Date(entry.changedAt);

  return (
    <div className="flex flex-col gap-4">
      <Button className="w-fit" onPress={onBack} variant="ghost">
        <AltArrowLeftIcon />
        Auditoria
      </Button>

      <section className="border-border bg-surface flex flex-col gap-4 rounded-2xl border p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold">
              {AUDIT_ENTITY_LABEL[entry.entity] ?? entry.entity}
            </h1>
            <p className="text-muted mt-1 truncate text-sm">
              {offer ? `${offer.title} · ${offer.code}` : 'Esta oferta'}
            </p>
            <p className="text-muted mt-1 text-xs">{when.toLocaleString('pt-BR')}</p>
          </div>
          <Chip color={action.color} variant="soft">
            {action.done}
          </Chip>
        </div>
      </section>

      <RootOfferAuditDiff after={entry.after} before={entry.before} />

      <section className="border-border bg-surface flex flex-col gap-4 rounded-2xl border p-5">
        <h2 className="text-sm font-semibold">Quem fez</h2>
        <div className="min-w-0">
          <p className="truncate font-medium">{who?.name ?? entry.changedById}</p>
          <p className="text-muted truncate text-sm">{who?.email ?? '—'}</p>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          <Field label="Papel" value={`${entry.changedByRole} · ${entry.changedByPlatform}`} />
          <Field
            label="Impersonando"
            value={
              entry.isImpersonating
                ? `Sim${entry.actingUserId ? ` · ${entry.actingUserId}` : ''}`
                : 'Não'
            }
          />
        </dl>
      </section>

      <section className="border-border bg-surface flex flex-col gap-4 rounded-2xl border p-5">
        <h2 className="text-sm font-semibold">Requisição</h2>
        <div className="bg-surface-secondary rounded-xl px-3 py-2">
          <p className="truncate font-mono text-sm">
            {entry.method} {entry.path}
          </p>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          <Field label="IP" value={entry.ipAddress ?? '—'} />
          <Field label="User agent" value={entry.userAgent ?? '—'} />
        </dl>
        <CopyRow label="Request ID" value={entry.requestId ?? ''} />
        <CopyRow label="ID da entidade" value={entry.entityId} />
        <CopyRow label="ID do registro" value={entry.id} />
      </section>
    </div>
  );
};
