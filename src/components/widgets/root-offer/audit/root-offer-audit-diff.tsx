'use client';

import { useState } from 'react';

import { Button } from '@heroui/react';

import { asRecord, fieldLabel, formatAuditValue, jsonPretty } from './root-offer-audit.labels';

interface Props {
  before: unknown;
  after: unknown;
}

const DiffRow = ({
  field,
  previous,
  next,
}: {
  field: string;
  previous: unknown;
  next: unknown;
}) => {
  const changed = formatAuditValue(previous) !== formatAuditValue(next);

  return (
    <div
      className={`grid gap-2 rounded-xl px-3 py-2.5 sm:grid-cols-[minmax(0,9rem)_1fr_1fr] ${changed ? 'bg-surface-secondary' : ''}`}
    >
      <p className="text-muted text-[11px] font-semibold tracking-wide uppercase">
        {fieldLabel(field)}
      </p>
      <p className="text-muted min-w-0 font-mono text-xs break-all">{formatAuditValue(previous)}</p>
      <p
        className={`min-w-0 font-mono text-xs break-all ${changed ? 'font-semibold' : 'text-muted'}`}
      >
        {formatAuditValue(next)}
      </p>
    </div>
  );
};

export const RootOfferAuditDiff = ({ before, after }: Props) => {
  const [showAll, setShowAll] = useState(false);
  const previous = asRecord(before);
  const next = asRecord(after);

  if (!previous && !next) {
    return (
      <section className="border-border bg-surface flex flex-col gap-3 rounded-2xl border p-5">
        <h2 className="text-sm font-semibold">O que mudou</h2>
        <p className="text-muted text-sm">Este registro não traz um antes nem um depois.</p>
      </section>
    );
  }

  if (previous && next) {
    const keys = [...new Set([...Object.keys(previous), ...Object.keys(next)])];
    const changed = keys.filter(
      (key) => formatAuditValue(previous[key]) !== formatAuditValue(next[key]),
    );
    const visible = showAll ? keys : changed;
    const hidden = keys.length - changed.length;

    return (
      <section className="border-border bg-surface flex flex-col gap-3 rounded-2xl border p-5">
        <h2 className="text-sm font-semibold">O que mudou</h2>
        {changed.length === 0 && !showAll ? (
          <p className="text-muted text-sm">Nenhum campo auditado mudou neste registro.</p>
        ) : (
          <>
            <div className="text-muted hidden grid-cols-[minmax(0,9rem)_1fr_1fr] gap-2 px-3 text-[11px] tracking-wide uppercase sm:grid">
              <span>Campo</span>
              <span>Antes</span>
              <span>Depois</span>
            </div>
            <div className="flex flex-col">
              {visible.map((key) => (
                <DiffRow field={key} key={key} next={next[key]} previous={previous[key]} />
              ))}
            </div>
          </>
        )}
        {hidden > 0 ? (
          <Button
            className="w-fit"
            onPress={() => setShowAll((value) => !value)}
            size="sm"
            variant="tertiary"
          >
            {showAll ? 'Mostrar só o que mudou' : `Ver ${hidden} campos iguais`}
          </Button>
        ) : null}
      </section>
    );
  }

  return (
    <section className="border-border bg-surface flex flex-col gap-3 rounded-2xl border p-5">
      <h2 className="text-sm font-semibold">{previous ? 'Valor anterior' : 'Valor gravado'}</h2>
      <pre className="bg-surface-secondary max-h-80 overflow-auto rounded-xl p-3 font-mono text-xs whitespace-pre-wrap">
        {jsonPretty(previous ?? next)}
      </pre>
    </section>
  );
};
