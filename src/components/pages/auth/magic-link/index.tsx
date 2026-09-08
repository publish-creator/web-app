'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button, Spinner } from '@heroui/react';

import { messageFromError } from '@/lib/api/error-message';
import { nextRouteFor } from '@/lib/auth/pending-route';
import { useLazyGetSessionQuery, useMagicLinkConsumeMutation } from '@/store/services/auth';
import { AuthOnboardingShell } from '@/widgets/auth-onboarding';

/**
 * Where the emailed link lands. The token is spent here, once — the API refuses it a second time —
 * so this must not fire twice, which React's development double-invoke would otherwise do.
 */
export default function MagicLinkPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');
  const consumed = useRef(false);
  const [error, setError] = useState('');

  const [consume] = useMagicLinkConsumeMutation();
  const [loadSession] = useLazyGetSessionQuery();

  useEffect(() => {
    /** No token is knowable at render time, so it is rendered from `token` rather than stored. */
    if (!token) return;

    if (consumed.current) return;

    consumed.current = true;

    consume({ token })
      .unwrap()
      .then(async (result) => {
        /** An account with a second factor gets a challenge here too, not a session. */
        if (result.mfaRequired) {
          router.push('/auth/mfa-challenge');

          return;
        }

        const session = await loadSession().unwrap();

        router.push(nextRouteFor(session));
      })
      .catch((cause: unknown) => {
        setError(messageFromError(cause));
      });
  }, [consume, loadSession, router, token]);

  const message = token ? error : 'Link inválido. Peça um novo e-mail de acesso.';

  return (
    <AuthOnboardingShell width="max-w-[450px]">
      <div className="flex w-full flex-col items-center gap-6 text-center">
        {message ? (
          <>
            <h1 className="text-2xl font-semibold tracking-tight">Não foi possível entrar</h1>
            <p className="text-muted text-sm leading-relaxed">{message}</p>
            <Button fullWidth onPress={() => router.push('/auth/sign-in')} size="lg">
              Voltar ao login
            </Button>
          </>
        ) : (
          <>
            <Spinner className="size-6" />
            <p className="text-muted text-sm">Entrando…</p>
          </>
        )}
      </div>
    </AuthOnboardingShell>
  );
}
