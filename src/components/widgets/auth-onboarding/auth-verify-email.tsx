'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button, ErrorMessage } from '@heroui/react';

import { messageFromError } from '@/lib/api/error-message';
import { nextRouteFor } from '@/lib/auth/pending-route';
import {
  useGetSessionQuery,
  useLazyGetSessionQuery,
  useVerifyEmailConfirmMutation,
  useVerifyEmailRequestMutation,
} from '@/store/services/auth';
import { AuthSignUpOtpField } from '@/widgets/auth-sign-up/auth-sign-up-otp-field';
import { RESEND_COOLDOWN } from '@/widgets/auth-sign-up/auth-sign-up.constants';

import { AuthOnboardingShell } from './auth-onboarding-shell';

export function AuthVerifyEmail() {
  const router = useRouter();
  const { data: session } = useGetSessionQuery();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const [requestCode, { isLoading: isSending }] = useVerifyEmailRequestMutation();
  const [confirmCode, { isLoading: isConfirming }] = useVerifyEmailConfirmMutation();
  const [loadSession] = useLazyGetSessionQuery();

  const email = session?.user.email ?? '';

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);

    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const send = async () => {
    if (!email || cooldown > 0) return;

    setError('');

    try {
      await requestCode({ email }).unwrap();
      setCooldown(RESEND_COOLDOWN);
    } catch (cause) {
      setError(messageFromError(cause));
    }
  };

  const confirm = async (value: string) => {
    if (!email) return;

    setError('');

    try {
      await confirmCode({ email, code: value }).unwrap();

      const next = await loadSession().unwrap();

      router.push(nextRouteFor(next));
    } catch (cause) {
      /**
       * The API answers a wrong code, an expired one and too many attempts identically — telling
       * them apart would say whether a guess was close. So does this.
       */
      setError(messageFromError(cause));
      setCode('');
    }
  };

  return (
    <AuthOnboardingShell width="max-w-[450px]">
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Confirme seu e-mail</h1>
          <p className="text-muted text-sm leading-relaxed">
            Enviamos um código de 6 dígitos para <strong>{email || 'seu e-mail'}</strong>. Ele vale
            por 10 minutos.
          </p>
        </div>

        <AuthSignUpOtpField
          errorMessage={undefined}
          onChange={(value) => {
            setCode(value);
            setError('');
          }}
          onComplete={(value) => void confirm(value)}
          value={code}
        />

        {error ? <ErrorMessage>{error}</ErrorMessage> : null}

        <div className="flex flex-col gap-3">
          <Button
            fullWidth
            isDisabled={code.length !== 6}
            isPending={isConfirming}
            onPress={() => void confirm(code)}
            size="lg"
          >
            Confirmar
          </Button>
          <Button
            fullWidth
            isDisabled={cooldown > 0 || !email}
            isPending={isSending}
            onPress={() => void send()}
            variant="secondary"
          >
            {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Enviar código'}
          </Button>
        </div>
      </div>
    </AuthOnboardingShell>
  );
}
