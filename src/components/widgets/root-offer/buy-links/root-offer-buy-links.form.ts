import { z } from 'zod';

import type { BuyLink, BuyLinkWriteBody } from '@/store/services/offers/offer-details.types';

export const buyLinkFormSchema = z.object({
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().max(2000),
  imageUrl: z.string().nullable(),
  imageUploadId: z.string().uuid().nullable(),
  url: z
    .string()
    .trim()
    .url()
    .refine((value) => /^https?:\/\//i.test(value), { message: 'Use http:// ou https://' }),
  value: z.number().min(0).max(9_999_999_999),
  cpa: z.number().min(0).max(9_999_999_999).nullable(),
  isAvailableForAllUsers: z.boolean(),
  allowedUserIds: z.array(z.string().uuid()).max(500),
});

export type BuyLinkFormValues = z.infer<typeof buyLinkFormSchema>;

export const EMPTY_BUY_LINK_FORM: BuyLinkFormValues = {
  title: '',
  description: '',
  imageUrl: null,
  imageUploadId: null,
  url: '',
  value: 0,
  cpa: null,
  isAvailableForAllUsers: true,
  allowedUserIds: [],
};

export const formValuesFromLink = (link: BuyLink): BuyLinkFormValues => ({
  title: link.title,
  description: link.description ?? '',
  imageUrl: link.imageUrl,
  imageUploadId: link.imageUploadId ?? null,
  url: link.url,
  value: Number(link.value),
  cpa: link.cpa === null ? null : Number(link.cpa),
  isAvailableForAllUsers: link.isAvailableForAllUsers,
  allowedUserIds: link.allowedUserIds,
});

export const writeBodyFrom = (values: BuyLinkFormValues): BuyLinkWriteBody => {
  const parsed = buyLinkFormSchema.parse(values);

  return {
    title: parsed.title,
    description: parsed.description || null,
    imageUploadId: parsed.imageUploadId,
    url: parsed.url,
    value: parsed.value,
    cpa: parsed.cpa,
    isAvailableForAllUsers: parsed.isAvailableForAllUsers,
    allowedUserIds: parsed.isAvailableForAllUsers ? [] : parsed.allowedUserIds,
  };
};
