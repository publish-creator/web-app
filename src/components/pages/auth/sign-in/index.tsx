'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LetterIcon } from '@solar-icons/react/linear';
import { Controller, useForm } from 'react-hook-form';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button, Checkbox, ErrorMessage, Link, Spinner } from '@heroui/react';

import { PasswordField, TextField } from '@/components/composites';
import { messageFromError } from '@/lib/api/error-message';
import { nextRouteFor } from '@/lib/auth/pending-route';
import { useLazyGetSessionQuery, useSignInMutation } from '@/store/services/auth';
import { AlternativeSign, AuthFlowHeader } from '@/widgets/auth';

import { signInSchema } from './sign-in.schema';
import type { SignInSchemaInput } from './sign-in.schema';

export default function SignInPage() {
  const router = useRouter();
  const [signIn, { isLoading }] = useSignInMutation();
  const [loadSession] = useLazyGetSessionQuery();
  const [error, setError] = useState('');
  const form = useForm<SignInSchemaInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInSchemaInput) => {
    setError('');

    try {
      const result = await signIn(data).unwrap();

      if (result.mfaRequired) {
        router.push('/auth/mfa-challenge');

        return;
      }

      const session = await loadSession().unwrap();

      router.push(nextRouteFor(session));
    } catch (cause) {
      setError(messageFromError(cause));
    }
  };

  return (
    <div className="auth-sign-in-bg bg-background text-foreground relative flex min-h-screen w-full flex-col">
      <div className="from-background/80 pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-linear-to-b to-transparent" />

      <div className="relative z-20 flex min-h-screen w-full flex-col">
        <AuthFlowHeader
          action={
            <p className="text-muted text-xs font-medium">
              Não possui conta?{' '}
              <Link className="text-accent text-xs font-medium no-underline" href="/auth/sign-up">
                Criar conta
              </Link>
            </p>
          }
        />

        <div className="relative flex flex-1 grow flex-col justify-center pt-6 md:pt-10">
          <div className="flex w-full flex-1 justify-center overflow-x-hidden px-8 pb-10">
            <div className="flex w-full max-w-[450px] flex-col items-center gap-6">
              <Image alt="Logo" height={104} src="/images/markepublish-icone.svg" width={104} />

              <form
                className="flex w-full flex-col gap-8"
                onSubmit={form.handleSubmit((data) => void onSubmit(data))}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
                  <p className="text-muted max-w-101 text-sm leading-relaxed">
                    Digite seu email e senha para entrar no sistema
                  </p>
                </div>

                <fieldset className="flex flex-col gap-3">
                  <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        aria-label="Email"
                        errorMessage={fieldState.error?.message}
                        placeholder="Digite seu email"
                        startContent={<LetterIcon className="text-muted size-5" />}
                        type="email"
                        variant="secondary"
                      />
                    )}
                  />
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
                  <div className="flex items-center justify-between">
                    <Checkbox id="remember-me" variant="secondary">
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <Checkbox.Content className="text-sm">Lembrar-me</Checkbox.Content>
                    </Checkbox>
                    <Link className="text-muted text-sm no-underline" href="/auth/forgot-password">
                      Esqueceu sua senha?
                    </Link>
                  </div>
                </fieldset>

                {error ? <ErrorMessage>{error}</ErrorMessage> : null}

                <Button fullWidth isPending={isLoading} size="lg" type="submit">
                  {isLoading ? <Spinner className="size-4" color="current" /> : 'Entrar'}
                </Button>
              </form>

              <div className="w-full">
                <AlternativeSign />
              </div>
            </div>
          </div>
        </div>

        <footer className="hidden flex-col items-center justify-center gap-1 py-4 text-center md:flex">
          <p className="text-muted text-xs">
            © 2026 - Todos os direitos reservados |{' '}
            <Link className="text-muted text-xs no-underline" href="#">
              Termos
            </Link>{' '}
            |{' '}
            <Link className="text-muted text-xs no-underline" href="#">
              Privacidade
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
