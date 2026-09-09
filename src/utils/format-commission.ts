import type { CommissionType } from '@/store/services/offers/offers.types';

export function formatCommission(
  value: string,
  type: CommissionType,
  currency: string | null,
): string {
  const trimmed = value.trim();
  const amount = Number(trimmed);

  if (trimmed === '' || !Number.isFinite(amount)) return '—';

  if (type === 'REV_SHARE') {
    return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(amount)}%`;
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency || 'BRL',
  }).format(amount);
}
