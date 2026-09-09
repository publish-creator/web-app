'use client';

import { createContext, use, useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { messageFromError } from '@/lib/api/error-message';
import { useSignUpMutation } from '@/store/services/auth';

import { DEFAULT_COUNTRY, SIGN_UP_TOTAL_STEPS } from './auth-sign-up.constants';
import type { SignUpBusinessType } from './auth-sign-up.schemas';

export type SignUpFormData = {
  code: string;
  email: string;
  country: string;
  businessType?: SignUpBusinessType;
  firstName?: string;
  lastName?: string;
  businessName?: string;
};

type SignUpContextValue = {
  step: number;
  data: SignUpFormData;
  error: string;
  isSubmitting: boolean;
  goToStep: (nextStep: number, updates?: Partial<SignUpFormData>) => void;

  submit: (updates?: Partial<SignUpFormData>) => void;
};

const INITIAL_DATA: SignUpFormData = {
  code: '',
  email: '',
  country: DEFAULT_COUNTRY,
};

function nameFrom(data: SignUpFormData): string {
  if (data.businessType === 'COMPANY') return (data.businessName ?? '').trim();

  return [data.firstName, data.lastName].filter(Boolean).join(' ').trim();
}

const SignUpContext = createContext<SignUpContextValue | null>(null);

export function AuthSignUpProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SignUpFormData>(INITIAL_DATA);
  const [error, setError] = useState('');
  const [signUp, { isLoading: isSubmitting }] = useSignUpMutation();

  const goToStep = useCallback((nextStep: number, updates?: Partial<SignUpFormData>) => {
    if (nextStep < 1 || nextStep > SIGN_UP_TOTAL_STEPS) return;

    if (updates) setData((current) => ({ ...current, ...updates }));

    setError('');
    setStep(nextStep);
  }, []);

  const submit = useCallback(
    (updates?: Partial<SignUpFormData>) => {
      const next = { ...data, ...updates };

      setData(next);
      setError('');

      signUp({
        code: next.code,
        name: nameFrom(next),
        email: next.email,
        country: next.country.toUpperCase(),
      })
        .unwrap()
        .then(() => {
          setStep(SIGN_UP_TOTAL_STEPS);
        })
        .catch((cause: unknown) => {
          setError(messageFromError(cause));
        });
    },
    [data, signUp],
  );

  const value = useMemo<SignUpContextValue>(
    () => ({ step, data, error, isSubmitting, goToStep, submit }),
    [data, error, goToStep, isSubmitting, step, submit],
  );

  return <SignUpContext value={value}>{children}</SignUpContext>;
}

export function useAuthSignUp() {
  const context = use(SignUpContext);

  if (!context) {
    throw new Error('useAuthSignUp must be used within AuthSignUpProvider');
  }

  return context;
}
