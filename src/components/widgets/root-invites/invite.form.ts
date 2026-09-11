import { z } from 'zod';

import type { InviteCode, InviteCodeWriteBody } from '@/store/services/users/invite-codes.types';

const inSevenDays = () => {
  const date = new Date();

  date.setDate(date.getDate() + 7);

  return date.toISOString();
};

export const inviteFormSchema = z
  .object({
    kind: z.enum(['LINK', 'EMAIL']),
    email: z.string().email().or(z.literal('')),
    name: z.string().max(120),
    reusable: z.boolean(),
    maxUses: z.number().int().min(1).max(10_000).nullable(),
    expiresAt: z.string().min(1),
  })
  .superRefine((values, context) => {
    if (values.kind === 'EMAIL' && !values.email) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe o e-mail',
        path: ['email'],
      });
    }
  });

export type InviteFormValues = z.infer<typeof inviteFormSchema>;

export const EMPTY_INVITE_FORM: InviteFormValues = {
  kind: 'LINK',
  email: '',
  name: '',
  reusable: true,
  maxUses: 10,
  expiresAt: inSevenDays(),
};

export const formValuesFromInvite = (invite: InviteCode): InviteFormValues => ({
  kind: invite.email ? 'EMAIL' : 'LINK',
  email: invite.email ?? '',
  name: invite.name ?? '',
  reusable: invite.type === 'PERM',
  maxUses: invite.maxUses,
  expiresAt: invite.expiresAt,
});

export const writeBodyFrom = (values: InviteFormValues): InviteCodeWriteBody => {
  const parsed = inviteFormSchema.parse(values);
  const name = parsed.name.trim();

  return {
    kind: parsed.kind,
    reusable: parsed.reusable,
    maxUses: parsed.reusable ? parsed.maxUses : 1,
    expiresAt: new Date(parsed.expiresAt).toISOString(),
    ...(parsed.kind === 'EMAIL' && parsed.email ? { email: parsed.email } : {}),
    ...(name ? { name } : {}),
  };
};
