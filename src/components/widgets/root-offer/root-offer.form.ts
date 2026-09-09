import { z } from 'zod';

import type { Offer, OfferUpdateBody } from '@/store/services/offers/offers.types';

const OFFER_STATUS = ['DRAFT', 'PUBLISHED', 'INACTIVE'] as const;
const COMMISSION_TYPE = ['CPA', 'REV_SHARE'] as const;
const MAX_COMMISSION = 9_999_999_999;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || null)
    .nullable();

const commission = () => z.coerce.number().min(0, 'Não pode ser negativo').max(MAX_COMMISSION);

export const offerFormSchema = z
  .object({
    title: z.string().trim().min(2, 'Mínimo de 2 caracteres').max(180),
    description: optionalText(2000),
    imageUrl: optionalText(2000),
    status: z.enum(OFFER_STATUS),
    categoryId: z.string().uuid('Selecione a categoria'),
    nicheId: z.string().uuid().nullable(),
    structureId: z.string().uuid().nullable(),
    angle: optionalText(2000),
    currency: optionalText(10),
    pvUrl: optionalText(2000),

    frontCommissionType: z.enum(COMMISSION_TYPE),
    frontCommissionValue: commission(),
    backCommissionType: z.enum(COMMISSION_TYPE),
    backCommissionValue: commission(),
    recurrenceCommissionType: z.enum(COMMISSION_TYPE),
    recurrenceCommissionValue: commission(),
  })
  .superRefine((data, context) => {
    if (data.status === 'PUBLISHED' && !data.pvUrl) {
      context.addIssue({
        code: 'custom',
        message: 'Publicar exige o link da página de vendas',
        path: ['pvUrl'],
      });
    }
  });

export type OfferFormInput = z.input<typeof offerFormSchema>;
export type OfferFormValues = z.output<typeof offerFormSchema>;

export function formValuesFrom(offer: Offer): OfferFormInput {
  return {
    title: offer.title,
    description: offer.description ?? '',
    imageUrl: offer.imageUrl ?? '',
    status: offer.status,
    categoryId: offer.category?.id ?? '',
    nicheId: offer.niche?.id ?? null,
    structureId: offer.structure?.id ?? null,
    angle: offer.angle ?? '',
    currency: offer.currency ?? '',
    pvUrl: offer.pvUrl ?? '',
    frontCommissionType: offer.frontCommissionType,
    frontCommissionValue: Number(offer.frontCommissionValue),
    backCommissionType: offer.backCommissionType,
    backCommissionValue: Number(offer.backCommissionValue),
    recurrenceCommissionType: offer.recurrenceCommissionType,
    recurrenceCommissionValue: Number(offer.recurrenceCommissionValue),
  };
}

export function updateBodyFrom(offer: Offer, values: OfferFormValues): OfferUpdateBody {
  return {
    ...values,
    paymentPlatform: offer.paymentPlatform,
    countries: offer.countries,
    countryGroupIds: offer.countryGroupIds,
    isAvailableForAllUsers: offer.isAvailableForAllUsers,
    allowedPlatformRoles: offer.allowedPlatformRoles,
    allowedUserIds: offer.allowedUserIds,
    tags: offer.tags.map((tag) => ({
      name: tag.name,
      active: tag.active,
      userTagIds: tag.userTagIds,
    })),
    commissionMode: offer.commissionMode,
  };
}
