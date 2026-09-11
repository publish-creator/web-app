import type { InviteCodeStatus } from '@/store/services/users/invite-codes.types';

export const FILTER_ALL = 'all';

export const STATUS_META: Record<
  InviteCodeStatus,
  { label: string; color: 'success' | 'warning' | 'danger' | 'default' }
> = {
  ACTIVE: { label: 'Ativo', color: 'success' },
  EXPIRED: { label: 'Expirado', color: 'warning' },
  EXHAUSTED: { label: 'Esgotado', color: 'default' },
  REVOKED: { label: 'Revogado', color: 'danger' },
};

export const STATUS_TABS = [
  { id: FILTER_ALL, label: 'Todos' },
  { id: 'ACTIVE', label: 'Ativos' },
  { id: 'EXPIRED', label: 'Expirados' },
  { id: 'EXHAUSTED', label: 'Esgotados' },
  { id: 'REVOKED', label: 'Revogados' },
] as const;
