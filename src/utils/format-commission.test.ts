import { describe, expect, it } from 'vitest';

import { formatCommission } from './format-commission';

describe('formatCommission', () => {
  it('reads the decimal string as a plain amount, not as cents', () => {
    const formatted = formatCommission('100.00', 'CPA', 'BRL');

    expect(formatted).toContain('100');
    expect(formatted).not.toContain('1,00');
  });

  it('renders a revenue share as a percentage, never as money', () => {
    const formatted = formatCommission('50.00', 'REV_SHARE', 'BRL');

    expect(formatted).toBe('50%');
    expect(formatted).not.toMatch(/R\$|\$/);
  });

  it('keeps the two decimals the column carries', () => {
    expect(formatCommission('12.50', 'REV_SHARE', null)).toBe('12,5%');
    expect(formatCommission('12.34', 'CPA', 'BRL')).toContain('12,34');
  });

  it('uses the offer currency when it has one', () => {
    expect(formatCommission('10.00', 'CPA', 'USD')).toContain('US$');
  });

  it('falls back to a currency rather than crashing when the offer has none', () => {
    expect(formatCommission('10.00', 'CPA', null)).toContain('10');
  });

  it('answers a dash for a value that is not a number, instead of NaN on screen', () => {
    expect(formatCommission('', 'CPA', 'BRL')).toBe('—');
    expect(formatCommission('nao-e-numero', 'REV_SHARE', null)).toBe('—');
  });
});
