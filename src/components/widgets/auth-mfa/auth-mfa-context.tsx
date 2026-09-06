'use client';

import { createContext, use, useMemo, useState } from 'react';

import type { ReactNode } from 'react';

export type MfaStep = 1 | 2;

type AuthMfaContextValue = {
  step: MfaStep;
  code: string;
  error: string;
  setCode: (code: string) => void;
  activate: () => void;
  goToStep: (step: MfaStep) => void;
};

const AuthMfaContext = createContext<AuthMfaContextValue | null>(null);

export function AuthMfaProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<MfaStep>(1);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const value = useMemo<AuthMfaContextValue>(
    () => ({
      step,
      code,
      error,
      setCode: (nextCode) => {
        setCode(nextCode);
        setError('');
      },
      activate: () => {
        if (code.length !== 6) {
          setError('Informe o código de 6 dígitos');
          return;
        }

        setError('');
        setStep(2);
      },
      goToStep: setStep,
    }),
    [code, error, step],
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
