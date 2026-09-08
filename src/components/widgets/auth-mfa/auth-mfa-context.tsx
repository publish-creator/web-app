'use client';

import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';
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
  /** The otpauth URL the QR code is drawn from. Null until the setup call answers. */
  otpauthUrl: string | null;
  secret: string | null;
  /** Shown exactly once, on the step after confirming. Nothing can produce them again. */
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

  /**
   * The secret is asked for once, when the screen opens. Calling setup again replaces it on the
   * server, which would silently invalidate the entry the person may have already scanned.
   */
  useEffect(() => {
    let cancelled = false;

    mfaSetup()
      .unwrap()
      .then((data) => {
        if (cancelled) return;

        setOtpauthUrl(data.otpauthUrl);
        setSecret(data.secret);
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(messageFromError(cause));
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliberately once per mount, see above
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

  /**
   * Only after the codes have been shown. Where they go next comes from the server's pending list,
   * not from an assumption that MFA was the last thing owed.
   */
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
