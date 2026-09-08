import { z } from 'zod';

import { OTP_LENGTH, getPhoneDialCode, isValidPhoneNumber } from './auth-sign-up.constants';

/** The API's floor is six characters; anything shorter is refused there anyway. */
export const signUpInviteSchema = z.object({
  code: z
    .string()
    .trim()
    .min(6, { message: 'O código de convite tem no mínimo 6 caracteres' })
    .max(64, { message: 'Código de convite inválido' }),
});

export const signUpEmailSchema = z.object({
  email: z.email({ message: 'Informe um e-mail válido' }),
});

export const signUpOtpSchema = z.object({
  code: z.string().length(OTP_LENGTH, { message: 'Informe o código de 6 dígitos' }),
});

export const signUpPersonalSchema = z
  .object({
    businessType: z.enum(['INDIVIDUAL', 'COMPANY'], {
      message: 'Selecione o tipo de perfil',
    }),
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    businessName: z.string().trim(),
  })
  .superRefine((data, context) => {
    if (data.businessType === 'INDIVIDUAL') {
      if (!data.firstName) {
        context.addIssue({
          code: 'custom',
          message: 'Informe o nome',
          path: ['firstName'],
        });
      }

      if (!data.lastName) {
        context.addIssue({
          code: 'custom',
          message: 'Informe o sobrenome',
          path: ['lastName'],
        });
      }

      return;
    }

    if (!data.businessName) {
      context.addIssue({
        code: 'custom',
        message: 'Informe o nome da empresa',
        path: ['businessName'],
      });
    }
  });

export const signUpCountrySchema = z.object({
  country: z.string().min(1, { message: 'Selecione o país' }),
});

export const signUpPhoneSchema = z
  .object({
    dialCountry: z.string().min(1, { message: 'Selecione o DDI' }),
    phone: z.string().min(1, { message: 'Informe o número de celular' }),
  })
  .superRefine((data, context) => {
    const dialCode = getPhoneDialCode(data.dialCountry).dialCode;

    if (!isValidPhoneNumber(data.phone, dialCode)) {
      context.addIssue({
        code: 'custom',
        message: 'Informe um número de celular válido',
        path: ['phone'],
      });
    }
  });

export const signUpPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
      .regex(/[A-Z]/, { message: 'A senha deve conter pelo menos uma letra maiúscula' })
      .regex(/[a-z]/, { message: 'A senha deve conter pelo menos uma letra minúscula' })
      .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número' })
      .regex(/[#?!@$%^&*-]/, { message: 'A senha deve conter pelo menos um caractere especial' }),
    verifyPassword: z.string().min(1, { message: 'Confirme a senha' }),
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: 'As senhas não coincidem',
    path: ['verifyPassword'],
  });

export type SignUpInviteInput = z.input<typeof signUpInviteSchema>;
export type SignUpEmailInput = z.input<typeof signUpEmailSchema>;
export type SignUpOtpInput = z.input<typeof signUpOtpSchema>;
export type SignUpPersonalInput = z.input<typeof signUpPersonalSchema>;
export type SignUpCountryInput = z.input<typeof signUpCountrySchema>;
export type SignUpPhoneInput = z.input<typeof signUpPhoneSchema>;
export type SignUpPasswordInput = z.input<typeof signUpPasswordSchema>;
export type SignUpBusinessType = SignUpPersonalInput['businessType'];
