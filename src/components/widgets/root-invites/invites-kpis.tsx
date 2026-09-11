'use client';

import { KPI } from '@heroui-pro/react';

import type { InviteCodeCounts } from '@/store/services/users/invite-codes.types';

const CARDS: { key: keyof InviteCodeCounts; label: string }[] = [
  { key: 'total', label: 'Códigos' },
  { key: 'active', label: 'Ativos' },
  { key: 'exhausted', label: 'Esgotados' },
  { key: 'revoked', label: 'Revogados' },
];

export const RootInvitesKpis = ({ counts }: { counts?: InviteCodeCounts | undefined }) => (
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
