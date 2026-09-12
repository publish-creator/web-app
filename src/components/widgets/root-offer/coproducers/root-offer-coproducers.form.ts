import { z } from 'zod';

import type {
  Coproducer,
  CoproducerStatus,
  CoproducerWriteBody,
} from '@/store/services/offers/offer-details.types';

export const COPRODUCER_STATUS = ['ACTIVE', 'PAUSED', 'INVITED'] as const;

export const STATUS_LABEL: Record<CoproducerStatus, string> = {
  ACTIVE: 'Ativo',
  PAUSED: 'Pausado',
  INVITED: 'Convidado',
};

export const coproducerFormSchema = z.object({
  userId: z.string().uuid(),
  userName: z.string(),
  userEmail: z.string(),
  status: z.enum(COPRODUCER_STATUS),
  sameAsFront: z.boolean(),
  frontCommissionType: z.enum(['CPA', 'REV_SHARE']),
  frontCommissionValue: z.number().min(0),
  backCommissionType: z.enum(['CPA', 'REV_SHARE']),
  backCommissionValue: z.number().min(0),
  recurrenceCommissionType: z.enum(['CPA', 'REV_SHARE']),
  recurrenceCommissionValue: z.number().min(0),
  payRefund: z.boolean(),
  payTransactionalTax: z.boolean(),
});

export type CoproducerFormValues = z.infer<typeof coproducerFormSchema>;

export const EMPTY_COPRODUCER_FORM: CoproducerFormValues = {
  userId: '',
  userName: '',
  userEmail: '',
  status: 'ACTIVE',
  sameAsFront: false,
  frontCommissionType: 'CPA',
  frontCommissionValue: 0,
  backCommissionType: 'CPA',
  backCommissionValue: 0,
  recurrenceCommissionType: 'CPA',
  recurrenceCommissionValue: 0,
  payRefund: true,
  payTransactionalTax: true,
};

export function createBodyFrom(values: CoproducerFormValues): CoproducerWriteBody {
  const backType = values.sameAsFront ? values.frontCommissionType : values.backCommissionType;
  const backValue = values.sameAsFront ? values.frontCommissionValue : values.backCommissionValue;
  const recurrenceType = values.sameAsFront
    ? values.frontCommissionType
    : values.recurrenceCommissionType;
  const recurrenceValue = values.sameAsFront
    ? values.frontCommissionValue
    : values.recurrenceCommissionValue;

  return {
    userId: values.userId,
    status: values.status,
    frontCommissionType: values.frontCommissionType,
    frontCommissionValue: values.frontCommissionValue,
    backCommissionType: backType,
    backCommissionValue: backValue,
    recurrenceCommissionType: recurrenceType,
    recurrenceCommissionValue: recurrenceValue,
    payRefund: values.payRefund,
    payTransactionalTax: values.payTransactionalTax,
  };
}

export function formValuesFrom(row: Coproducer): CoproducerFormValues {
  const sameAsFront =
    row.frontCommissionType === row.backCommissionType &&
    Number(row.frontCommissionValue) === Number(row.backCommissionValue) &&
    row.frontCommissionType === row.recurrenceCommissionType &&
    Number(row.frontCommissionValue) === Number(row.recurrenceCommissionValue);

  return {
    userId: row.userId,
    userName: row.user?.name ?? '',
    userEmail: row.user?.email ?? '',
    status: row.status,
    sameAsFront,
    frontCommissionType: row.frontCommissionType,
    frontCommissionValue: Number(row.frontCommissionValue),
    backCommissionType: row.backCommissionType,
    backCommissionValue: Number(row.backCommissionValue),
    recurrenceCommissionType: row.recurrenceCommissionType,
    recurrenceCommissionValue: Number(row.recurrenceCommissionValue),
    payRefund: row.payRefund,
    payTransactionalTax: row.payTransactionalTax,
  };
}
