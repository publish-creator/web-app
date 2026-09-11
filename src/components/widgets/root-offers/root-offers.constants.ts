import type { OfferStatus } from '@/store/services/offers/offers.types';

export const STATUS_TABS = [
  { id: 'all', label: 'Todas' },
  { id: 'DRAFT', label: 'Rascunho' },
  { id: 'PUBLISHED', label: 'Publicada' },
  { id: 'INACTIVE', label: 'Inativa' },
] as const;

export type StatusTab = (typeof STATUS_TABS)[number]['id'];

export const STATUS_LABEL: Record<OfferStatus, string> = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicada',
  INACTIVE: 'Inativa',
};

export const STATUS_TONE: Record<OfferStatus, string> = {
  DRAFT: 'bg-surface-secondary text-muted',
  PUBLISHED: 'bg-success/10 text-success',
  INACTIVE: 'bg-danger/10 text-danger',
};

export function statusParam(tab: string | undefined): OfferStatus | undefined {
  return tab === 'DRAFT' || tab === 'PUBLISHED' || tab === 'INACTIVE' ? tab : undefined;
}
