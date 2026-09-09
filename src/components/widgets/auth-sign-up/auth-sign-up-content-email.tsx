'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LetterIcon } from '@solar-icons/react/linear';
import { Controller, useForm } from 'react-hook-form';

import { Button, ErrorMessage, Link } from '@heroui/react';

import { TextField } from '@/components/composites';

import { useAuthSignUp } from './auth-sign-up-context';
import { signUpEmailSchema } from './auth-sign-up.schemas';
import type { SignUpEmailInput } from './auth-sign-up.schemas';

export function AuthSignUpContentEmail() {
  const { data, error, isSubmitting, submit } = useAuthSignUp();
  const form = useForm<SignUpEmailInput>({
    resolver: zodResolver(signUpEmailSchema),
    defaultValues: { email: data.email },
  });

  const onSubmit = (values: SignUpEmailInput) => {
    submit({ email: values.email.trim() });
  };

  return (
    <form className="flex w-full flex-col gap-8" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Qual é o seu e-mail comercial?</h1>
        <p className="text-muted max-w-101 text-sm leading-relaxed">
          Enviaremos um link de acesso para este endereço, e é por ele que falaremos com você.
        </p>
      </div>

      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            aria-label="E-mail"
            errorMessage={fieldState.error?.message}
            placeholder="exemplo@empresa.com"
            startContent={<LetterIcon className="text-muted size-5" />}
            type="email"
            variant="secondary"
          />
        )}
      />

      {error ? <ErrorMessage>{error}</ErrorMessage> : null}

      <div className="flex flex-col gap-3">
        <Button fullWidth isPending={isSubmitting} size="lg" type="submit">
          Criar conta
        </Button>
        <p className="text-muted text-center text-xs leading-relaxed">
          Ao continuar, você confirma que leu e compreendeu a{' '}
          <Link className="text-accent text-xs no-underline" href="#">
            Política de Privacidade
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
