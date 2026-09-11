'use client';

import { KPI } from '@heroui-pro/react';

import type { AdminAffiliationCounts } from '@/store/services/offers/offer-details.types';

const CARDS: { key: keyof AdminAffiliationCounts; label: string }[] = [
  { key: 'total', label: 'Total de solicitações' },
  { key: 'approved', label: 'Solicitações aprovadas' },
  { key: 'rejected', label: 'Solicitações rejeitadas' },
  { key: 'pending', label: 'Solicitações pendentes' },
];

export const RootAffiliationsKpis = ({
  counts,
}: {
  counts?: AdminAffiliationCounts | undefined;
}) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {CARDS.map((card) => (
      <KPI key={card.key}>
        <KPI.Header>
          <KPI.Title>{card.label}</KPI.Title>
        </KPI.Header>
        <KPI.Content>
          <KPI.Value maximumFractionDigits={0} value={counts?.[card.key] ?? 0} />
        </KPI.Content>
      </KPI>
    ))}
  </div>
);
