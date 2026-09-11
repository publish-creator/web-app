'use client';

import Link from 'next/link';

import { Chip } from '@heroui/react';

import type { AffiliationDetail } from '@/store/services/offers/offer-details.types';
import { InviteStatusChip, inviteKindLabel, inviteUsesLabel } from '@/widgets/root-invites';

interface Props {
  data: AffiliationDetail;
}

export const AffiliationDetailInvite = ({ data }: Props) => {
  const invite = data.invite;

  if (!invite) {
    return (
      <section className="border-border bg-surface flex flex-col gap-2 rounded-2xl border p-5">
        <h2 className="text-sm font-semibold">Convite</h2>
        <p className="text-muted text-sm">Esta conta não usou código de convite no cadastro.</p>
      </section>
    );
  }

  const entered = new Date(invite.usedAt);

  return (
    <section className="border-border bg-surface flex flex-col gap-4 rounded-2xl border p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Convite</h2>
          <p className="text-muted text-xs">Código que cadastrou esta pessoa, e o uso dela.</p>
        </div>
        <InviteStatusChip invite={invite} />
      </div>
      <Link
        className="font-mono text-lg font-semibold tracking-wide"
        href={`/root/invites/${invite.id}`}
      >
        {invite.code}
      </Link>
      <dl className="text-muted grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-[11px] tracking-wide uppercase">Nome interno</dt>
          <dd className="text-foreground">{invite.name || '—'}</dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">E-mail do convite</dt>
          <dd className="text-foreground">{invite.email || 'Link aberto'}</dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">Validade</dt>
          <dd className="text-foreground">
            {invite.validity}
            <span className="text-muted block text-xs">{inviteKindLabel(invite)}</span>
          </dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">Usos do código</dt>
          <dd className="text-foreground">{inviteUsesLabel(invite)}</dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">Restantes</dt>
          <dd className="text-foreground">
            {invite.remainingUses === null ? 'Ilimitado' : invite.remainingUses}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">Expira em</dt>
          <dd className="text-foreground">{new Date(invite.expiresAt).toLocaleString('pt-BR')}</dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">Criado em</dt>
          <dd className="text-foreground">{new Date(invite.createdAt).toLocaleString('pt-BR')}</dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">Criado por</dt>
          <dd className="text-foreground">
            {invite.invitedBy ? `${invite.invitedBy.name} (${invite.invitedBy.email})` : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">Papel no cadastro</dt>
          <dd className="text-foreground">
            {invite.role} · {invite.platformRole}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">Entrou em</dt>
          <dd className="text-foreground">{entered.toLocaleString('pt-BR')}</dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">IP no cadastro</dt>
          <dd className="text-foreground font-mono text-xs">{invite.ipAddress || '—'}</dd>
        </div>
        <div className="sm:col-span-3">
          <dt className="text-[11px] tracking-wide uppercase">User agent</dt>
          <dd className="text-foreground text-xs break-all">{invite.userAgent || '—'}</dd>
        </div>
      </dl>
      {invite.revokedAt ? (
        <Chip color="danger" size="sm" variant="soft">
          Revogado em {new Date(invite.revokedAt).toLocaleString('pt-BR')}
        </Chip>
      ) : null}
    </section>
  );
};
