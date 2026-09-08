'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button, ErrorMessage, InputOTP, Link, Spinner } from '@heroui/react';

import { TextField } from '@/components/composites';
import { messageFromError } from '@/lib/api/error-message';
import { nextRouteFor } from '@/lib/auth/pending-route';
import {
  useLazyGetSessionQuery,
  useMfaRecoverMutation,
  useMfaVerifyMutation,
} from '@/store/services/auth';
import { AuthFlowHeader } from '@/widgets/auth';

type Mode = 'code' | 'recovery';

/**
 * The second half of signing in. Reaching this screen means the password was accepted and a
 * five-minute challenge cookie was set; nothing here is authenticated, and no session exists until
 * one of these two calls succeeds.
 */
export default function MfaChallengePage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('code');
  const [code, setCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [error, setError] = useState('');

  const [mfaVerify, { isLoading: isVerifying }] = useMfaVerifyMutation();
  const [mfaRecover, { isLoading: isRecovering }] = useMfaRecoverMutation();
  const [loadSession] = useLazyGetSessionQuery();

  const isLoading = isVerifying || isRecovering;

  const goOn = async () => {
    const session = await loadSession().unwrap();

    router.push(nextRouteFor(session));
  };

  const submit = async () => {
    setError('');

    try {
      if (mode === 'code') await mfaVerify({ code }).unwrap();
      else await mfaRecover({ code: recoveryCode }).unwrap();

      await goOn();
    } catch (cause) {
      /**
       * The API answers a wrong code, an expired challenge and a locked account differently on
       * purpose — a person who waited too long needs to be told to sign in again, not to keep typing
       * codes at a challenge that no longer exists.
       */
      setError(messageFromError(cause));
      setCode('');
    }
  };

  return (
    <div className="auth-sign-in-bg bg-background text-foreground relative flex min-h-screen w-full flex-col">
      <div className="relative z-20 flex min-h-screen w-full flex-col">
        <AuthFlowHeader
          action={
            <Link className="text-accent text-xs font-medium no-underline" href="/auth/sign-in">
              Voltar ao login
            </Link>
          }
        />

        <div className="relative flex flex-1 grow flex-col justify-center pt-6 md:pt-10">
          <div className="flex w-full flex-1 justify-center overflow-x-hidden px-8 pb-10">
            <div className="flex w-full max-w-[450px] flex-col items-center gap-6">
              <Image alt="Logo" height={104} src="/images/markepublish-icone.svg" width={104} />

              <form
                className="flex w-full flex-col gap-8"
                onSubmit={(event) => {
                  event.preventDefault();
                  void submit();
                }}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Verificação em duas etapas
                  </h1>
                  <p className="text-muted max-w-101 text-sm leading-relaxed">
                    {mode === 'code'
                      ? 'Digite o código de 6 dígitos do seu aplicativo autenticador.'
                      : 'Digite um dos códigos de recuperação que você guardou ao ativar a verificação.'}
                  </p>
                </div>

                {mode === 'code' ? (
                  <InputOTP
                    aria-label="Código do autenticador"
                    maxLength={6}
                    onChange={(next) => {
                      setCode(next);
                      setError('');
                    }}
                    value={code}
                    variant="secondary"
                  >
                    <InputOTP.Group className="justify-center gap-2">
                      {Array.from({ length: 6 }, (_, index) => (
                        <InputOTP.Slot className="size-12" index={index} key={index} />
                      ))}
                    </InputOTP.Group>
                  </InputOTP>
                ) : (
                  <TextField
                    aria-label="Código de recuperação"
                    onChange={(next: string) => {
                      setRecoveryCode(next);
                      setError('');
                    }}
                    placeholder="XXXX-XXXX-XXXX"
                    value={recoveryCode}
                    variant="secondary"
                  />
                )}

                {error ? <ErrorMessage>{error}</ErrorMessage> : null}

                <Button
                  fullWidth
                  isDisabled={mode === 'code' ? code.length !== 6 : recoveryCode.trim().length < 8}
                  isPending={isLoading}
                  size="lg"
                  type="submit"
                >
                  {isLoading ? <Spinner className="size-4" color="current" /> : 'Confirmar'}
                </Button>

                <button
                  className="text-muted text-sm underline-offset-4 hover:underline"
                  onClick={() => {
                    setMode(mode === 'code' ? 'recovery' : 'code');
                    setError('');
                  }}
                  type="button"
                >
                  {mode === 'code'
                    ? 'Perdi o acesso ao autenticador'
                    : 'Voltar para o código do aplicativo'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
