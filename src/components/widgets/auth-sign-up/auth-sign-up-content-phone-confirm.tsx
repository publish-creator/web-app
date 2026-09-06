'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@heroui/react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { AuthSignUpChangeDestination } from './auth-sign-up-change-destination';
import { useAuthSignUp } from './auth-sign-up-context';
import { AuthSignUpOtpField } from './auth-sign-up-otp-field';
import { OTP_LENGTH, RESEND_COOLDOWN } from './auth-sign-up.constants';
import { signUpOtpSchema } from './auth-sign-up.schemas';

import type { SignUpOtpInput } from './auth-sign-up.schemas';

export function AuthSignUpContentPhoneConfirm() {
  const { data, goToStep } = useAuthSignUp();
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const form = useForm<SignUpOtpInput>({
    resolver: zodResolver(signUpOtpSchema),
    defaultValues: { code: '' },
  });
  const formattedPhone = `${data.dialCode}${data.phone}`;

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => setCountdown((current) => current - 1), 1000);

    return () => window.clearTimeout(timer);
  }, [countdown]);

  const onSubmit = (values: SignUpOtpInput) => {
    if (values.code.length !== OTP_LENGTH) {
      return;
    }

    goToStep(7);
  };

  return (
    <form className="flex w-full flex-col gap-8" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Vamos verificar esse número</h1>
        <p className="text-muted text-sm leading-relaxed">
          Insira o código de 6 dígitos enviado para
        </p>
        <AuthSignUpChangeDestination
          actionLabel="Alterar número"
          hint="Errou o número ou não tem acesso a ele? Altere para receber o código em outro celular."
          onEdit={() => goToStep(5)}
          value={formattedPhone}
        />
      </div>

      <Controller
        control={form.control}
        name="code"
        render={({ field, fieldState }) => (
          <AuthSignUpOtpField
            errorMessage={fieldState.error?.message}
            onChange={field.onChange}
            onComplete={() => {
              void form.handleSubmit(onSubmit)();
            }}
            value={field.value}
          />
        )}
      />

      <div className="flex flex-col gap-3">
        <Button fullWidth size="lg" type="submit">
          Avançar
        </Button>
        <p className="text-muted text-center text-xs leading-relaxed">
          {countdown > 0 ? (
            `Você pode solicitar um código novamente em ${countdown} segundos`
          ) : (
            <>
              Não recebeu o código?{' '}
              <Button
                className="text-accent h-auto min-h-0 px-0 text-xs"
                onPress={() => {
                  form.reset({ code: '' });
                  setCountdown(RESEND_COOLDOWN);
                }}
                variant="ghost"
              >
                Solicitar novamente
              </Button>
            </>
          )}
        </p>
      </div>
    </form>
  );
}
