'use client';

import { Button, Card, Chip } from '@heroui/react';

import { InstagramIcon, TikTokIcon } from '@/components/base/icons-svg';
import type { SocialAccount } from '@/store/services/social-accounts';

import { PLATFORM_LABEL, STATUS, formatHandle } from './social-platform';

interface SocialAccountCardProps {
  account: SocialAccount;
  isDisconnecting: boolean;
  onDisconnect: () => void;
  onReconnect: () => void;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function SocialAccountCard({
  account,
  isDisconnecting,
  onDisconnect,
  onReconnect,
}: SocialAccountCardProps) {
  const status = STATUS[account.status];
  const needsAttention = account.status !== 'active';

  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="bg-surface-secondary grid size-10 shrink-0 place-items-center rounded-full">
            {account.platform === 'instagram' ? <InstagramIcon /> : <TikTokIcon />}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {formatHandle(account.username, account.externalAccountId)}
            </p>
            <p className="text-muted text-xs">
              {PLATFORM_LABEL[account.platform]}
              {account.accountType ? ` · ${account.accountType}` : ''}
            </p>
          </div>
        </div>
        <Chip color={status.color} variant="secondary">
          {status.label}
        </Chip>
      </div>

      {needsAttention ? <p className="text-muted text-xs">{status.hint}</p> : null}

      <dl className="text-muted grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="font-medium">Conectada em</dt>
          <dd className="tabular-nums">{formatDate(account.createdAt)}</dd>
        </div>
        <div>
          <dt className="font-medium">Acesso vence</dt>
          <dd className="tabular-nums">
            {account.tokenExpiresAt ? formatDate(account.tokenExpiresAt) : 'sem prazo'}
          </dd>
        </div>
      </dl>

      <div className="flex gap-2">
        {needsAttention ? (
          <Button className="flex-1" onPress={onReconnect} size="sm">
            Reconectar
          </Button>
        ) : null}
        <Button
          className={needsAttention ? '' : 'flex-1'}
          isPending={isDisconnecting}
          onPress={onDisconnect}
          size="sm"
          variant="secondary"
        >
          Desconectar
        </Button>
      </div>
    </Card>
  );
}
