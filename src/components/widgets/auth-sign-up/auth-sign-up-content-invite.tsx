'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { TicketIcon } from '@solar-icons/react/linear';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@heroui/react';

import { TextField } from '@/components/composites';

import { useAuthSignUp } from './auth-sign-up-context';
import { signUpInviteSchema } from './auth-sign-up.schemas';
import type { SignUpInviteInput } from './auth-sign-up.schemas';

export function AuthSignUpContentInvite() {
  const { data, goToStep } = useAuthSignUp();
  const form = useForm<SignUpInviteInput>({
    resolver: zodResolver(signUpInviteSchema),
    defaultValues: { code: data.code },
  });

  const onSubmit = (values: SignUpInviteInput) => {
    goToStep(2, { code: values.code.trim() });
  };

  return (
    <form className="flex w-full flex-col gap-8" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Você tem um convite?</h1>
        <p className="text-muted max-w-101 text-sm leading-relaxed">
          A criação de conta é feita por convite. Informe o código que você recebeu para continuar.
        </p>
      </div>

      <Controller
        control={form.control}
        name="code"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            aria-label="Código de convite"
            errorMessage={fieldState.error?.message}
            placeholder="Digite seu código de convite"
            startContent={<TicketIcon className="text-muted size-5" />}
            variant="secondary"
          />
        )}
      />

      <Button fullWidth size="lg" type="submit">
        Avançar
      </Button>
    </form>
  );
}
