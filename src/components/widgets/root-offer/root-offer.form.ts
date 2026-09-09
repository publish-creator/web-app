import { z } from 'zod';

import type { Offer, OfferUpdateBody } from '@/store/services/offers/offers.types';

const OFFER_STATUS = ['DRAFT', 'PUBLISHED', 'INACTIVE'] as const;
const COMMISSION_TYPE = ['CPA', 'REV_SHARE'] as const;
const PAYMENT_PLATFORM = ['SPARK', 'BUY_GOODS'] as const;
const MAX_COMMISSION = 9_999_999_999;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || null)
    .nullable();

const commission = () => z.coerce.number().min(0, 'Não pode ser negativo').max(MAX_COMMISSION);

const offerTag = z.object({
  name: z.string().trim().min(1, 'Dê um nome à tag').max(80),
  active: z.boolean(),
  userTagIds: z.array(z.string().uuid()).max(50),
});

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
    paymentPlatform: z.enum(PAYMENT_PLATFORM),
    countries: z.array(z.string().trim().length(2).toUpperCase()).max(300, 'No máximo 300 países'),
    countryGroupIds: z.array(z.string().uuid()).max(50, 'No máximo 50 grupos'),
    tags: z.array(offerTag).max(50, 'No máximo 50 tags'),
    isAvailableForAllUsers: z.boolean(),
    allowedUserIds: z.array(z.string().uuid()).max(500, 'No máximo 500 usuários'),
    allowsAutomaticAffiliation: z.boolean(),
    pvUrl: optionalText(2000),

    frontCommissionType: z.enum(COMMISSION_TYPE),
    frontCommissionValue: commission(),
    backCommissionType: z.enum(COMMISSION_TYPE),
    backCommissionValue: commission(),
    recurrenceCommissionType: z.enum(COMMISSION_TYPE),
    recurrenceCommissionValue: commission(),
  })
  .superRefine((data, context) => {
    const names = data.tags.map((tag) => tag.name.toLowerCase());

    data.tags.forEach((tag, index) => {
      if (names.indexOf(tag.name.toLowerCase()) !== index) {
        context.addIssue({
          code: 'custom',
          message: 'Já existe uma tag com esse nome nesta oferta',
          path: ['tags', index, 'name'],
        });
      }
    });

    if (data.status === 'PUBLISHED' && !data.pvUrl) {
      context.addIssue({
        code: 'custom',
        message: 'Publicar exige a página de vendas, que fica em Buy-Links',
        path: ['status'],
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
    paymentPlatform: offer.paymentPlatform,
    countries: offer.countries,
    countryGroupIds: offer.countryGroupIds,
    tags: offer.tags.map((tag) => ({
      name: tag.name,
      active: tag.active,
      userTagIds: tag.userTagIds,
    })),
    isAvailableForAllUsers: offer.isAvailableForAllUsers,
    allowedUserIds: offer.allowedUserIds,
    allowsAutomaticAffiliation: offer.allowsAutomaticAffiliation,
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
    allowedPlatformRoles: offer.allowedPlatformRoles,
    commissionMode: offer.commissionMode,
  };
}
