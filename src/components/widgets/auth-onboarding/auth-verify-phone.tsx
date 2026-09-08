'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button, ErrorMessage } from '@heroui/react';

import { TextField } from '@/components/composites';
import { messageFromError } from '@/lib/api/error-message';
import { HOME_ROUTE } from '@/lib/auth/pending-route';
import {
  useLazyGetSessionQuery,
  useVerifyPhoneConfirmMutation,
  useVerifyPhoneRequestMutation,
} from '@/store/services/auth';
import { AuthSignUpOtpField } from '@/widgets/auth-sign-up/auth-sign-up-otp-field';
import { RESEND_COOLDOWN } from '@/widgets/auth-sign-up/auth-sign-up.constants';

import { AuthOnboardingShell } from './auth-onboarding-shell';

/**
 * The API takes E.164 and nothing else — accepting other formats would mean storing three spellings
 * of one number and never being able to tell two rows apart. The field is normalised here rather
 * than letting the person discover the rule from a rejection.
 */
function toE164(input: string): string {
  const digits = input.replace(/\D/g, '');

  if (!digits) return '';

  /** A Brazilian number typed without a country code is the common case; assume +55 for it. */
  if (!input.trim().startsWith('+') && (digits.length === 10 || digits.length === 11)) {
    return `+55${digits}`;
  }

  return `+${digits}`;
}

export function AuthVerifyPhone() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const [requestCode, { isLoading: isSending }] = useVerifyPhoneRequestMutation();
  const [confirmCode, { isLoading: isConfirming }] = useVerifyPhoneConfirmMutation();
  const [loadSession] = useLazyGetSessionQuery();

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);

    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const send = async () => {
    const normalised = toE164(phone);

    if (!normalised) {
      setError('Informe o número com DDD');

      return;
    }

    setError('');

    try {
      await requestCode({ phone: normalised }).unwrap();
      setSentTo(normalised);
      setCooldown(RESEND_COOLDOWN);
    } catch (cause) {
      setError(messageFromError(cause));
    }
  };

  const confirm = async (value: string) => {
    setError('');

    try {
      await confirmCode({ code: value }).unwrap();
      await loadSession().unwrap();

      router.push(HOME_ROUTE);
    } catch (cause) {
      setError(messageFromError(cause));
      setCode('');
    }
  };

  return (
    <AuthOnboardingShell width="max-w-[450px]">
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Confirme seu celular</h1>
          <p className="text-muted text-sm leading-relaxed">
            {sentTo
              ? `Enviamos um código de 6 dígitos para ${sentTo}. Ele vale por 10 minutos.`
              : 'Vamos enviar um código por SMS para confirmar o número.'}
          </p>
        </div>

        {sentTo ? (
          <AuthSignUpOtpField
            errorMessage={undefined}
            onChange={(value) => {
              setCode(value);
              setError('');
            }}
            onComplete={(value) => void confirm(value)}
            value={code}
          />
        ) : (
          <TextField
            aria-label="Celular"
            onChange={(value: string) => {
              setPhone(value);
              setError('');
            }}
            placeholder="(11) 99999-9999"
            type="tel"
            value={phone}
            variant="secondary"
          />
        )}

        {error ? <ErrorMessage>{error}</ErrorMessage> : null}

        <div className="flex flex-col gap-3">
          {sentTo ? (
            <>
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
                isDisabled={cooldown > 0}
                isPending={isSending}
                onPress={() => void send()}
                variant="secondary"
              >
                {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar código'}
              </Button>
            </>
          ) : (
            <Button fullWidth isPending={isSending} onPress={() => void send()} size="lg">
              Enviar código
            </Button>
          )}
        </div>
      </div>
    </AuthOnboardingShell>
  );
}
