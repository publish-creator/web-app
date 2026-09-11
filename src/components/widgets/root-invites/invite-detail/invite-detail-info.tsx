import type { InviteCodeDetail } from '@/store/services/users/invite-codes.types';

interface Props {
  data: InviteCodeDetail;
}

export const InviteDetailInfo = ({ data }: Props) => (
  <section className="border-border bg-surface grid gap-3 rounded-2xl border p-5 sm:grid-cols-2 lg:grid-cols-4">
    <Info label="Validade" value={data.validity} />
    <Info
      label="Usos"
      value={`${data.usedCount}${data.maxUses === null ? ' / ∞' : ` / ${data.maxUses}`}`}
    />
    <Info
      label="Restantes"
      value={data.remainingUses === null ? 'Ilimitado' : String(data.remainingUses)}
    />
    <Info label="Expira em" value={new Date(data.expiresAt).toLocaleString('pt-BR')} />
    <Info label="Criado em" value={new Date(data.createdAt).toLocaleString('pt-BR')} />
    <Info label="Papel" value={`${data.role} · ${data.platformRole}`} />
    <Info label="E-mail vinculado" value={data.email || 'Nenhum'} />
    <Info
      label="Criado por"
      value={data.invitedBy ? `${data.invitedBy.name} (${data.invitedBy.email})` : '—'}
    />
  </section>
);

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <p className="text-muted text-[11px] tracking-wide uppercase">{label}</p>
    <p className="truncate text-sm font-medium">{value}</p>
  </div>
);
