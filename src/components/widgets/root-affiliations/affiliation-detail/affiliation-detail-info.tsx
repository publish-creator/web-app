'use client';

import { Avatar, Chip } from '@heroui/react';

import type { AffiliationDetail } from '@/store/services/offers/offer-details.types';

const USER_STATUS: Record<string, string> = {
  PENDING: 'Pendente',
  ACTIVE: 'Ativo',
  BLOCKED: 'Bloqueado',
};

const SOURCE_LABEL: Record<string, string> = {
  OFFER_DEFAULT: 'Padrão da oferta',
  MANUAL: 'Ajuste manual',
  AUTOMATIC_RULE: 'Regra automática',
};

interface Props {
  data: AffiliationDetail;
}

export const AffiliationDetailInfo = ({ data }: Props) => {
  const user = data.user;
  const requested = new Date(data.requestedAt);

  return (
    <section className="border-border bg-surface flex flex-col gap-4 rounded-2xl border p-5">
      <h2 className="text-sm font-semibold">Usuário</h2>
      <div className="flex items-center gap-3">
        <Avatar className="size-11">
          <Avatar.Fallback>{(user?.name ?? data.userId).charAt(0)}</Avatar.Fallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium">{user?.name ?? data.userId}</p>
          <p className="text-muted truncate text-sm">{user?.email ?? '—'}</p>
        </div>
      </div>
      <dl className="text-muted grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-[11px] tracking-wide uppercase">Telefone</dt>
          <dd className="text-foreground">{user?.phone || '—'}</dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">País</dt>
          <dd className="text-foreground">{user?.country || '—'}</dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">Status da conta</dt>
          <dd className="text-foreground">
            {user ? (USER_STATUS[user.status] ?? user.status) : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">Papel</dt>
          <dd className="text-foreground">{user?.platformRole ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">Pedido em</dt>
          <dd className="text-foreground">{requested.toLocaleString('pt-BR')}</dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">Decidido em</dt>
          <dd className="text-foreground">
            {data.decidedAt ? new Date(data.decidedAt).toLocaleString('pt-BR') : 'Ainda não'}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">Quem decidiu</dt>
          <dd className="text-foreground">
            {data.decidedBy
              ? `${data.decidedBy.name} (${data.decidedBy.email})`
              : data.decidedAt
                ? 'Automático'
                : 'Aguardando'}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-wide uppercase">Origem da comissão</dt>
          <dd className="text-foreground">
            {SOURCE_LABEL[data.commissionSource] ?? data.commissionSource}
          </dd>
        </div>
      </dl>
      {data.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {data.tags.map((tag) => (
            <Chip key={tag.id} size="sm" variant="soft">
              {tag.name}
            </Chip>
          ))}
        </div>
      ) : (
        <p className="text-muted text-xs">Sem tags.</p>
      )}
    </section>
  );
};
