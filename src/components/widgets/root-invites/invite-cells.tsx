import Link from 'next/link';

import { Chip } from '@heroui/react';

import type { InviteCode } from '@/store/services/users/invite-codes.types';

import { STATUS_META } from './invites.constants';

export const inviteUsesLabel = (row: Pick<InviteCode, 'maxUses' | 'usedCount'>) => {
  if (row.maxUses === null) return `${row.usedCount} / ∞`;

  return `${row.usedCount} / ${row.maxUses}`;
};

export const inviteKindLabel = (row: Pick<InviteCode, 'type' | 'maxUses'>) => {
  if (row.type === 'TEMP' || row.maxUses === 1) return 'Uso único';
  if (row.maxUses === null) return 'Ilimitado';

  return 'Cota de usos';
};

export const InviteCodeCell = ({ invite }: { invite: InviteCode }) => (
  <Link className="flex max-w-52 min-w-0 flex-col" href={`/root/invites/${invite.id}`}>
    <span className="truncate font-mono text-sm font-semibold tracking-wide">{invite.code}</span>
    <span className="text-muted truncate text-xs">
      {invite.name || invite.email || 'Link aberto'}
    </span>
  </Link>
);

export const InviteValidityCell = ({ invite }: { invite: InviteCode }) => (
  <div className="max-w-40 min-w-0">
    <p className="truncate text-sm">{invite.validity}</p>
    <p className="text-muted truncate text-xs">{inviteKindLabel(invite)}</p>
  </div>
);

export const InviteUsesCell = ({ invite }: { invite: InviteCode }) => (
  <span className="font-medium">{inviteUsesLabel(invite)}</span>
);

export const InviteStatusChip = ({ invite }: { invite: InviteCode }) => {
  const status = STATUS_META[invite.status];

  return (
    <Chip color={status.color} size="sm" variant="soft">
      {status.label}
    </Chip>
  );
};
