'use client';

import { createContext, use, useMemo, useState } from 'react';

import { DEFAULT_COUNTRY, SIGN_UP_TOTAL_STEPS } from './auth-sign-up.constants';

import type { SignUpBusinessType } from './auth-sign-up.schemas';
import type { ReactNode } from 'react';

export type SignUpFormData = {
  email: string;
  businessType?: SignUpBusinessType;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  country: string;
  phone: string;
  dialCode: string;
  dialCountry: string;
};

type SignUpContextValue = {
  step: number;
  data: SignUpFormData;
  goToStep: (nextStep: number, updates?: Partial<SignUpFormData>) => void;
};

const INITIAL_DATA: SignUpFormData = {
  email: '',
  country: DEFAULT_COUNTRY,
  phone: '',
  dialCode: '+55',
  dialCountry: DEFAULT_COUNTRY,
};

const SignUpContext = createContext<SignUpContextValue | null>(null);

export function AuthSignUpProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SignUpFormData>(INITIAL_DATA);

  const value = useMemo<SignUpContextValue>(
    () => ({
      step,
      data,
      goToStep: (nextStep, updates) => {
        if (nextStep < 1 || nextStep > SIGN_UP_TOTAL_STEPS) {
          return;
        }

        if (updates) {
          setData((current) => ({ ...current, ...updates }));
        }

        setStep(nextStep);
      },
    }),
    [data, step],
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
