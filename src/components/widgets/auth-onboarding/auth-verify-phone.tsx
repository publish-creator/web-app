'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button, ErrorMessage } from '@heroui/react';

import { messageFromError } from '@/lib/api/error-message';
import { nextRouteFor } from '@/lib/auth/pending-route';
import {
  useLazyGetSessionQuery,
  useVerifyPhoneConfirmMutation,
  useVerifyPhoneRequestMutation,
} from '@/store/services/auth';
import { AuthSignUpDialSelect } from '@/widgets/auth-sign-up/auth-sign-up-dial-select';
import { AuthSignUpOtpField } from '@/widgets/auth-sign-up/auth-sign-up-otp-field';
import {
  DEFAULT_COUNTRY,
  RESEND_COOLDOWN,
  getPhoneDialCode,
  isValidPhoneNumber,
} from '@/widgets/auth-sign-up/auth-sign-up.constants';

import { AuthOnboardingShell } from './auth-onboarding-shell';

function toE164(dialCode: string, national: string): string {
  const digits = national.replace(/\D/g, '');

  if (!digits) return '';

  return `${dialCode}${digits}`;
}

export function AuthVerifyPhone() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [dialCountry, setDialCountry] = useState(DEFAULT_COUNTRY);
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
    const { dialCode } = getPhoneDialCode(dialCountry);

    if (!isValidPhoneNumber(phone, dialCode)) {
      setError('Informe um número de celular válido, com DDD');

      return;
    }

    const normalised = toE164(dialCode, phone);

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

      const session = await loadSession().unwrap();

      router.push(nextRouteFor(session));
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
          <div className="flex w-full flex-col gap-2">
            <div
              className={`bg-surface-secondary flex h-14 items-center overflow-hidden rounded-xl ${
                error ? 'border-danger border' : ''
              }`}
            >
              <AuthSignUpDialSelect
                onChange={(code) => {
                  setDialCountry(code);
                  setPhone('');
                  setError('');
                }}
                value={dialCountry}
              />
              <div className="bg-border h-6 w-px shrink-0" />
              <input
                aria-label="Número de celular"
                className="placeholder:text-muted min-w-0 flex-1 bg-transparent px-4 text-base outline-none"
                inputMode="tel"
                onChange={(event) => {
                  setPhone(event.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                placeholder="11999999999"
                type="tel"
                value={phone}
              />
            </div>
            <p className="text-muted text-xs">Enviaremos um código de verificação via SMS</p>
          </div>
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
