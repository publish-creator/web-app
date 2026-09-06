'use client';

import { PasswordField } from '@/components/composites';
import { CircleCheck, CircleXmark } from '@gravity-ui/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ProgressBar } from '@heroui/react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { useAuthSignUp } from './auth-sign-up-context';
import { PASSWORD_RULES } from './auth-sign-up.constants';
import { signUpPasswordSchema } from './auth-sign-up.schemas';

import type { SignUpPasswordInput } from './auth-sign-up.schemas';

export function AuthSignUpContentPassword() {
  const { goToStep } = useAuthSignUp();
  const form = useForm<SignUpPasswordInput>({
    resolver: zodResolver(signUpPasswordSchema),
    defaultValues: {
      password: '',
      verifyPassword: '',
    },
  });
  const password = useWatch({ control: form.control, name: 'password' }) ?? '';
  const passedRules = PASSWORD_RULES.filter((rule) => rule.rule.test(password)).length;
  const progress = (passedRules / PASSWORD_RULES.length) * 100;

  const onSubmit = () => {
    goToStep(8);
  };

  return (
    <form className="flex w-full flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Crie uma senha segura</h1>
        <p className="text-muted text-sm leading-relaxed">
          Defina uma senha para proteger sua conta. Ela precisa atender a todos os critérios abaixo.
        </p>
      </div>

      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <PasswordField
            {...field}
            aria-label="Senha"
            errorMessage={fieldState.error?.message}
            placeholder="Digite sua senha"
            variant="secondary"
          />
        )}
      />

      <Controller
        control={form.control}
        name="verifyPassword"
        render={({ field, fieldState }) => (
          <PasswordField
            {...field}
            aria-label="Confirmar senha"
            errorMessage={fieldState.error?.message}
            placeholder="Repita a senha"
            variant="secondary"
          />
        )}
      />

      {password.length > 0 ? (
        <div className="flex flex-col gap-4">
          <ProgressBar aria-label="Força da senha" className="w-full" size="sm" value={progress}>
            <ProgressBar.Track>
              <ProgressBar.Fill />
            </ProgressBar.Track>
          </ProgressBar>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm">A senha deve conter</p>
            {PASSWORD_RULES.map((rule) => {
              const isValid = rule.rule.test(password);

              return (
                <div className="flex items-center gap-2" key={rule.key}>
                  {isValid ? (
                    <CircleCheck className="text-accent size-4" />
                  ) : (
                    <CircleXmark className="text-danger size-4" />
                  )}
                  <p className="text-muted text-sm">{rule.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <Button fullWidth size="lg" type="submit">
        Criar conta
      </Button>
    </form>
  );
}
