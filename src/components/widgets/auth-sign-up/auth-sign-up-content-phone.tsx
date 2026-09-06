'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@heroui/react';
import { InfoCircleIcon } from '@solar-icons/react/linear';
import { Controller, useForm } from 'react-hook-form';

import { useAuthSignUp } from './auth-sign-up-context';
import { AuthSignUpDialSelect } from './auth-sign-up-dial-select';
import { getPhoneDialCode } from './auth-sign-up.constants';
import { signUpPhoneSchema } from './auth-sign-up.schemas';

import type { SignUpPhoneInput } from './auth-sign-up.schemas';

export function AuthSignUpContentPhone() {
  const { data, goToStep } = useAuthSignUp();
  const defaultDialCountry = data.country || data.dialCountry;
  const form = useForm<SignUpPhoneInput>({
    resolver: zodResolver(signUpPhoneSchema),
    defaultValues: {
      dialCountry: data.dialCountry || defaultDialCountry,
      phone: data.phone,
    },
  });
  const phoneError = form.formState.errors.phone?.message;
  const dialError = form.formState.errors.dialCountry?.message;

  const onSubmit = (values: SignUpPhoneInput) => {
    const dial = getPhoneDialCode(values.dialCountry);

    goToStep(6, {
      phone: values.phone,
      dialCountry: values.dialCountry,
      dialCode: dial.dialCode,
    });
  };

  return (
    <form className="flex w-full flex-col gap-8" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Agora, adicione seu número de celular</h1>
        <p className="text-muted flex items-center justify-center gap-1 text-sm leading-relaxed">
          Usaremos este número para verificar sua conta.
          <InfoCircleIcon className="text-muted size-4" />
        </p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <div
          className={`bg-surface-secondary flex h-14 items-center overflow-hidden rounded-xl ${
            phoneError || dialError ? 'border-danger border' : ''
          }`}
        >
          <Controller
            control={form.control}
            name="dialCountry"
            render={({ field }) => (
              <AuthSignUpDialSelect
                onChange={(code) => {
                  field.onChange(code);
                  form.setValue('phone', '');
                }}
                value={field.value}
              />
            )}
          />
          <div className="bg-border h-6 w-px shrink-0" />
          <Controller
            control={form.control}
            name="phone"
            render={({ field }) => (
              <input
                aria-label="Número de celular"
                className="placeholder:text-muted min-w-0 flex-1 bg-transparent px-4 text-base outline-none"
                id="sign-up-phone"
                inputMode="tel"
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(event.target.value.replace(/\D/g, ''))}
                placeholder="11999999999"
                type="tel"
                value={field.value}
              />
            )}
          />
        </div>
        {phoneError || dialError ? (
          <p className="text-danger text-xs">{phoneError ?? dialError}</p>
        ) : (
          <p className="text-muted text-xs">Enviaremos um código de verificação via SMS</p>
        )}
      </div>

      <Button fullWidth size="lg" type="submit">
        Avançar
      </Button>
    </form>
  );
}
