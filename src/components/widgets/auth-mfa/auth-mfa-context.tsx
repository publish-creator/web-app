'use client';

import { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { messageFromError } from '@/lib/api/error-message';
import { HOME_ROUTE, nextRouteFor } from '@/lib/auth/pending-route';
import {
  useLazyGetSessionQuery,
  useMfaConfirmMutation,
  useMfaSetupMutation,
} from '@/store/services/auth';

export type MfaStep = 1 | 2;

type AuthMfaContextValue = {
  step: MfaStep;
  code: string;
  error: string;

  otpauthUrl: string | null;
  secret: string | null;

  recoveryCodes: string[];
  isPreparing: boolean;
  isActivating: boolean;
  setCode: (code: string) => void;
  activate: () => void;
  finish: () => void;
  goToStep: (step: MfaStep) => void;
};

const AuthMfaContext = createContext<AuthMfaContextValue | null>(null);

export function AuthMfaProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [step, setStep] = useState<MfaStep>(1);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  const [mfaSetup, { isLoading: isPreparing }] = useMfaSetupMutation();
  const [mfaConfirm, { isLoading: isActivating }] = useMfaConfirmMutation();
  const [loadSession] = useLazyGetSessionQuery();

  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;

    requested.current = true;

    mfaSetup()
      .unwrap()
      .then((data) => {
        setOtpauthUrl(data.otpauthUrl);
        setSecret(data.secret);
      })
      .catch((cause: unknown) => {
        setError(messageFromError(cause));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per mount, guarded by the ref against StrictMode's double invoke
  }, []);

  const activate = useCallback(() => {
    if (code.length !== 6) {
      setError('Informe o código de 6 dígitos');

      return;
    }

    setError('');

    mfaConfirm({ code })
      .unwrap()
      .then((data) => {
        setRecoveryCodes(data.recoveryCodes);
        setStep(2);
      })
      .catch((cause: unknown) => {
        setError(messageFromError(cause));
      });
  }, [code, mfaConfirm]);

  const finish = useCallback(() => {
    loadSession()
      .unwrap()
      .then((session) => {
        router.push(nextRouteFor(session));
      })
      .catch(() => {
        router.push(HOME_ROUTE);
      });
  }, [loadSession, router]);

  const value = useMemo<AuthMfaContextValue>(
    () => ({
      step,
      code,
      error,
      otpauthUrl,
      secret,
      recoveryCodes,
      isPreparing,
      isActivating,
      setCode: (nextCode) => {
        setCode(nextCode);
        setError('');
      },
      activate,
      finish,
      goToStep: setStep,
    }),
    [
      activate,
      code,
      error,
      finish,
      isActivating,
      isPreparing,
      otpauthUrl,
      recoveryCodes,
      secret,
      step,
    ],
  );

  return <AuthMfaContext value={value}>{children}</AuthMfaContext>;
}

export function useAuthMfa() {
  const context = use(AuthMfaContext);

  if (!context) {
    throw new Error('useAuthMfa must be used within AuthMfaProvider');
  }

  return context;
}
