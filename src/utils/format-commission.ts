import type { CommissionType } from '@/store/services/offers/offers.types';

/**
 * Commission values arrive as decimal strings — `Decimal(12,2)` on the API side, serialised as a
 * string so no float rounds them on the way here.
 *
 * `formatCurrency` cannot be used for these: it divides by 100 because it expects cents, and these
 * are plain amounts. `100` here means one hundred, not one.
 *
 * The type decides the unit. With `CPA` the value is money; with `REV_SHARE` it is a percentage of
 * the sale, so rendering it as currency would say "$50" where the offer means "half".
 */
export function formatCommission(
  value: string,
  type: CommissionType,
  currency: string | null,
): string {
  const trimmed = value.trim();
  const amount = Number(trimmed);

  /** `Number('')` is 0, not NaN, so a blank value would otherwise print as a real zero. */
  if (trimmed === '' || !Number.isFinite(amount)) return '—';

  if (type === 'REV_SHARE') {
    return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(amount)}%`;
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency || 'BRL',
  }).format(amount);
}
