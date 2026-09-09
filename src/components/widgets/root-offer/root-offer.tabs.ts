export const OFFER_TABS = [
  { id: 'detalhes', label: 'Detalhes' },
  { id: 'comissao', label: 'Comissão' },
  { id: 'buy-links', label: 'Buy-Links' },
  { id: 'afiliados', label: 'Afiliados' },
  { id: 'arquivos', label: 'Arquivos' },
  { id: 'coprodutores', label: 'Coprodutores' },
] as const;

export type OfferTab = (typeof OFFER_TABS)[number]['id'];

export const DEFAULT_TAB: OfferTab = 'detalhes';

export function offerTabFrom(value: string | undefined): OfferTab {
  return OFFER_TABS.some((tab) => tab.id === value) ? (value as OfferTab) : DEFAULT_TAB;
}
