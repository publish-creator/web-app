'use client';

import { Copy, Pencil } from '@gravity-ui/icons';
import { AltArrowLeftIcon } from '@solar-icons/react/linear';

import { Button, Chip } from '@heroui/react';

import type { InviteCodeDetail } from '@/store/services/users/invite-codes.types';

import { inviteKindLabel, inviteUsesLabel } from '../invite-cells';
import { STATUS_META } from '../invites.constants';

interface Props {
  data: InviteCodeDetail;
  copied: boolean;
  isRevoking: boolean;
  onBack: () => void;
  onCopy: () => void;
  onEdit: () => void;
  onRevoke: () => void;
}

export const InviteDetailHeader = ({
  data,
  copied,
  isRevoking,
  onBack,
  onCopy,
  onEdit,
  onRevoke,
}: Props) => {
  const status = STATUS_META[data.status];
  const canChange = data.status !== 'REVOKED';

  return (
    <div className="flex flex-col gap-4">
      <Button className="w-fit" onPress={onBack} variant="ghost">
        <AltArrowLeftIcon />
        Convites
      </Button>

      <div className="border-border bg-surface flex flex-col gap-5 rounded-2xl border p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate font-mono text-xl font-semibold tracking-wide">{data.code}</h1>
            <p className="text-muted truncate text-sm">
              {data.name || data.email || 'Link aberto'}
            </p>
            <p className="text-muted mt-1 text-xs">
              {inviteKindLabel(data)} · {inviteUsesLabel(data)}
            </p>
          </div>
          <Chip color={status.color} variant="soft">
            {status.label}
          </Chip>
        </div>

        <div className="bg-surface-secondary flex min-w-0 items-center gap-2 rounded-xl px-3 py-2">
          <p className="min-w-0 flex-1 truncate font-mono text-xs">{data.signupUrl}</p>
          <Button onPress={onCopy} size="sm" variant="tertiary">
            <Copy className="size-4" />
            {copied ? 'Copiado' : 'Copiar link'}
          </Button>
        </div>

        {canChange ? (
          <div className="flex flex-wrap gap-2">
            <Button onPress={onEdit} variant="secondary">
              <Pencil className="size-4" />
              Editar
            </Button>
            <Button
              className="text-danger"
              isPending={isRevoking}
              onPress={onRevoke}
              variant="tertiary"
            >
              Revogar
            </Button>
          </div>
        ) : (
          <p className="text-muted text-xs">
            Este código foi revogado. Ele não aceita mais cadastros.
          </p>
        )}
      </div>
    </div>
  );
};
