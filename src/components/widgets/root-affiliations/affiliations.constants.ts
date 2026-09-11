import type { AffiliationStatus } from '@/store/services/offers/offer-details.types';

export const FILTER_ALL = 'ALL';

export const STATUS_META: Record<
  AffiliationStatus,
  { label: string; color: 'warning' | 'success' | 'danger' | 'default' }
> = {
  PENDING: { label: 'Pendente', color: 'warning' },
  APPROVED: { label: 'Aprovado', color: 'success' },
  REJECTED: { label: 'Recusado', color: 'danger' },
  CANCELED: { label: 'Cancelado', color: 'default' },
};

export const SOURCE_META: Record<string, string> = {
  OFFER_DEFAULT: 'Padrão da oferta',
  MANUAL: 'Ajuste manual',
  AUTOMATIC_RULE: 'Regra automática',
};
