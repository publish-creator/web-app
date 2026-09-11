import type {
  OfferAuditAction,
  OfferAuditEntity,
} from '@/store/services/offers/offer-details.types';

export const AUDIT_ENTITY_LABEL: Record<OfferAuditEntity, string> = {
  OFFER: 'Oferta',
  BUY_LINK: 'Buy-link',
  OFFER_COPRODUCER: 'Coprodutor',
  AUTOMATIC_AFFILIATION: 'Afiliação automática',
  AFFILIATION: 'Afiliação',
  OFFER_CREATIVE: 'Criativo',
  OFFER_COPY: 'Cópia',
  OFFER_AVATAR: 'Avatar',
};

export const AUDIT_ACTION_META: Record<
  OfferAuditAction,
  { label: string; done: string; color: 'success' | 'warning' | 'danger' }
> = {
  CREATED: { label: 'Criou', done: 'Criado', color: 'success' },
  UPDATED: { label: 'Atualizou', done: 'Atualizado', color: 'warning' },
  DELETED: { label: 'Removeu', done: 'Removido', color: 'danger' },
};

export const AUDIT_FIELD_LABEL: Record<string, string> = {
  commissionMode: 'Modo de comissão',
  frontCommissionType: 'Tipo front',
  frontCommissionValue: 'Valor front',
  backCommissionType: 'Tipo back',
  backCommissionValue: 'Valor back',
  recurrenceCommissionType: 'Tipo recorrência',
  recurrenceCommissionValue: 'Valor recorrência',
  pvUrl: 'URL da PV',
  countries: 'Países',
  countryGroupIds: 'Grupos de países',
  status: 'Status',
  deletedAt: 'Removido em',
  isAvailableForAllUsers: 'Disponível para todos',
  allowedPlatformRoles: 'Papéis permitidos',
  allowsAutomaticAffiliation: 'Afiliação automática',
  url: 'URL',
  value: 'Valor',
  cpa: 'CPA',
  type: 'Tipo',
  uploadId: 'Upload',
  imageUploadId: 'Imagem',
  content: 'Conteúdo',
  userId: 'Usuário',
  commissionSource: 'Origem da comissão',
  enabled: 'Ativa',
  applyTo: 'Aplica a',
  excludedUserIds: 'Usuários excluídos',
  payRefund: 'Paga reembolso',
  payTransactionalTax: 'Paga taxa',
};

export const jsonPretty = (value: unknown) => {
  if (value === null || value === undefined) return '—';

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

export const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  return value as Record<string, unknown>;
};

export const formatAuditValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.length === 0 ? 'nenhum' : value.map(String).join(', ');

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

export const fieldLabel = (key: string) => AUDIT_FIELD_LABEL[key] ?? key;
