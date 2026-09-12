import { z } from 'zod';

import type {
  ApplyTo,
  AutomaticAffiliation,
  AutomaticAffiliationJobStatus,
  AutomaticAffiliationWriteBody,
} from '@/store/services/offers/offer-details.types';
import type { CommissionType } from '@/store/services/offers/offers.types';

export const APPLY_TO = ['NEW_USERS', 'OLD_USERS', 'ALL_USERS'] as const;

export type { ApplyTo };

export const APPLY_TO_OPTIONS = [
  {
    id: 'NEW_USERS',
    label: 'Novos usuários',
    hint: 'Só no cadastro com etiqueta, ou no botão Afiliar',
  },
  {
    id: 'OLD_USERS',
    label: 'Usuários antigos',
    hint: 'Quem já tem a etiqueta entra ao salvar',
  },
  {
    id: 'ALL_USERS',
    label: 'Todos os usuários',
    hint: 'Quem já existe e quem entrar depois',
  },
] as const;

export const JOB_STATUS_LABEL: Record<AutomaticAffiliationJobStatus, string> = {
  PENDING: 'Lote pendente',
  IN_PROGRESS: 'Afiliando',
  COMPLETED: 'Lote concluído',
};

export const MAX_RULES_PER_OFFER = 20;
export const MAX_TAGS_PER_RULE = 100;

const commissionType = z.enum(['CPA', 'REV_SHARE']);
const commissionValue = z.number().min(0);

export const autoAffiliationFormSchema = z.object({
  userTagIds: z.array(z.string().uuid()).min(1).max(MAX_TAGS_PER_RULE),
  applyTo: z.enum(APPLY_TO),
  enabled: z.boolean(),
  sameAsFront: z.boolean(),
  frontCommissionType: commissionType,
  frontCommissionValue: commissionValue,
  backCommissionType: commissionType,
  backCommissionValue: commissionValue,
  recurrenceCommissionType: commissionType,
  recurrenceCommissionValue: commissionValue,
});

export type AutoAffiliationFormValues = z.infer<typeof autoAffiliationFormSchema>;

export const EMPTY_RULE_FORM: AutoAffiliationFormValues = {
  userTagIds: [],
  applyTo: 'NEW_USERS',
  enabled: true,
  sameAsFront: false,
  frontCommissionType: 'CPA',
  frontCommissionValue: 0,
  backCommissionType: 'CPA',
  backCommissionValue: 0,
  recurrenceCommissionType: 'CPA',
  recurrenceCommissionValue: 0,
};

export type AutomaticAffiliationRule = AutoAffiliationFormValues & {
  id: string;
  jobStatus: AutomaticAffiliationJobStatus;
  updatedAt: string;
};

export function toRule(row: AutomaticAffiliation): AutomaticAffiliationRule {
  return {
    id: row.id,
    userTagIds: row.userTags.map((tag) => tag.id),
    applyTo: row.applyTo,
    enabled: row.enabled,
    jobStatus: row.jobStatus ?? 'PENDING',
    sameAsFront: false,
    frontCommissionType: row.frontCommissionType,
    frontCommissionValue: Number(row.frontCommissionValue),
    backCommissionType: row.backCommissionType,
    backCommissionValue: Number(row.backCommissionValue),
    recurrenceCommissionType: row.recurrenceCommissionType,
    recurrenceCommissionValue: Number(row.recurrenceCommissionValue),
    updatedAt: row.updatedAt,
  };
}

export function createBodyFrom(values: AutoAffiliationFormValues): AutomaticAffiliationWriteBody {
  const uniqueIds = [...new Set(values.userTagIds)];
  const backType = values.sameAsFront ? values.frontCommissionType : values.backCommissionType;
  const backValue = values.sameAsFront ? values.frontCommissionValue : values.backCommissionValue;
  const recurrenceType = values.sameAsFront
    ? values.frontCommissionType
    : values.recurrenceCommissionType;
  const recurrenceValue = values.sameAsFront
    ? values.frontCommissionValue
    : values.recurrenceCommissionValue;

  return {
    userTagIds: uniqueIds,
    applyTo: values.applyTo,
    enabled: values.enabled,
    frontCommissionType: values.frontCommissionType,
    frontCommissionValue: values.frontCommissionValue,
    backCommissionType: backType,
    backCommissionValue: backValue,
    recurrenceCommissionType: recurrenceType,
    recurrenceCommissionValue: recurrenceValue,
  };
}

export function formValuesFromRule(rule: AutomaticAffiliationRule): AutoAffiliationFormValues {
  const sameAsFront =
    rule.frontCommissionType === rule.backCommissionType &&
    rule.frontCommissionValue === rule.backCommissionValue &&
    rule.frontCommissionType === rule.recurrenceCommissionType &&
    rule.frontCommissionValue === rule.recurrenceCommissionValue;

  return {
    userTagIds: rule.userTagIds,
    applyTo: rule.applyTo,
    enabled: rule.enabled,
    sameAsFront: rule.sameAsFront || sameAsFront,
    frontCommissionType: rule.frontCommissionType,
    frontCommissionValue: rule.frontCommissionValue,
    backCommissionType: rule.backCommissionType,
    backCommissionValue: rule.backCommissionValue,
    recurrenceCommissionType: rule.recurrenceCommissionType,
    recurrenceCommissionValue: rule.recurrenceCommissionValue,
  };
}

export function applyToMeta(applyTo: ApplyTo) {
  return APPLY_TO_OPTIONS.find((option) => option.id === applyTo) ?? APPLY_TO_OPTIONS[0];
}

export function formatCommissionAmount(
  type: CommissionType,
  value: number,
  currency: string | null,
) {
  if (type === 'REV_SHARE') return `${value.toFixed(2)}%`;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency && currency.length === 3 ? currency : 'USD',
  }).format(value);
}
