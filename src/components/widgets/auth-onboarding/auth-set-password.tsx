'use client';

import { CircleCheck, CircleXmark } from '@gravity-ui/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button, ErrorMessage, ProgressBar } from '@heroui/react';

import { PasswordField } from '@/components/composites';
import { messageFromError } from '@/lib/api/error-message';
import { nextRouteFor } from '@/lib/auth/pending-route';
import { useLazyGetSessionQuery, useSetPasswordMutation } from '@/store/services/auth';
import { PASSWORD_RULES } from '@/widgets/auth-sign-up/auth-sign-up.constants';
import { signUpPasswordSchema } from '@/widgets/auth-sign-up/auth-sign-up.schemas';
import type { SignUpPasswordInput } from '@/widgets/auth-sign-up/auth-sign-up.schemas';

import { AuthOnboardingShell } from './auth-onboarding-shell';

/**
 * Setting the first password needs a session, and the only session that exists at this point came
 * from the emailed link — which is why this screen is reached after that link, never during
 * registration. The API also closes a window on it, so somebody who leaves this page open for a long
 * time is asked to request a new link rather than being let through.
 */
export function AuthSetPassword() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [setPassword, { isLoading }] = useSetPasswordMutation();
  const [loadSession] = useLazyGetSessionQuery();

  const form = useForm<SignUpPasswordInput>({
    resolver: zodResolver(signUpPasswordSchema),
    defaultValues: { password: '', verifyPassword: '' },
  });

  const password = useWatch({ control: form.control, name: 'password' }) ?? '';
  const passedRules = PASSWORD_RULES.filter((rule) => rule.rule.test(password)).length;
  const progress = (passedRules / PASSWORD_RULES.length) * 100;

  const onSubmit = async (values: SignUpPasswordInput) => {
    setError('');

    try {
      await setPassword({ password: values.password }).unwrap();

      const session = await loadSession().unwrap();

      router.push(nextRouteFor(session));
    } catch (cause) {
      setError(messageFromError(cause));
    }
  };

  return (
    <AuthOnboardingShell>
      <form
        className="flex w-full flex-col gap-6"
        onSubmit={form.handleSubmit((values) => void onSubmit(values))}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Crie uma senha segura</h1>
          <p className="text-muted text-sm leading-relaxed">
            Defina uma senha para proteger sua conta. Ela precisa atender a todos os critérios
            abaixo.
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
              {PASSWORD_RULES.map((rule) => (
                <div className="flex items-center gap-2" key={rule.key}>
                  {rule.rule.test(password) ? (
                    <CircleCheck className="text-accent size-4" />
                  ) : (
                    <CircleXmark className="text-danger size-4" />
                  )}
                  <p className="text-muted text-sm">{rule.label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {error ? <ErrorMessage>{error}</ErrorMessage> : null}

        <Button fullWidth isPending={isLoading} size="lg" type="submit">
          Salvar senha
        </Button>
      </form>
    </AuthOnboardingShell>
  );
}
