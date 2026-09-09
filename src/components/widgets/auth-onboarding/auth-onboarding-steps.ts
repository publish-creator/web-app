import type { PendingStep } from '@/store/services/auth/auth.types';

export type OnboardingStep = {
  id: PendingStep;
  label: string;
  subtitle: string;
  route: string;
  illustration?: { alt: string; src: string };
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'VERIFY_EMAIL',
    label: 'E-mail',
    subtitle: 'Confirme seu endereço',
    route: '/auth/verify-email',
    illustration: { alt: 'Verificação de e-mail', src: '/images/auth/02-email-otp.svg' },
  },
  {
    id: 'VERIFY_PHONE',
    label: 'Celular',
    subtitle: 'Confirme por SMS',
    route: '/auth/verify-phone',
    illustration: { alt: 'Contato móvel', src: '/images/auth/05-mobile-contact.svg' },
  },
  {
    id: 'SET_PASSWORD',
    label: 'Senha',
    subtitle: 'Proteja sua conta',
    route: '/auth/set-password',
    illustration: { alt: 'Senha segura', src: '/images/auth/07-secure-password.svg' },
  },
  { id: 'ENABLE_MFA', label: 'Duas etapas', subtitle: 'Ative o autenticador', route: '/mfa' },
  { id: 'ACCEPT_TERMS', label: 'Termos', subtitle: 'Leia e aceite', route: '/auth/terms' },
];

export function stepForPath(pathname: string): OnboardingStep | undefined {
  return ONBOARDING_STEPS.find((step) => pathname.startsWith(step.route));
}

export type StepState = 'done' | 'current' | 'upcoming';

export function stepStates(
  pending: PendingStep[] | undefined,
  pathname: string,
): Record<PendingStep, StepState> {
  const owed = new Set(pending ?? []);
  const onScreen = stepForPath(pathname)?.id;
  const current = onScreen ?? pending?.[0];

  const states = {} as Record<PendingStep, StepState>;

  for (const step of ONBOARDING_STEPS) {
    if (step.id === current) states[step.id] = 'current';
    else if (owed.has(step.id)) states[step.id] = 'upcoming';
    else states[step.id] = 'done';
  }

  return states;
}

export function onboardingProgress(states: Record<PendingStep, StepState>): number {
  const done = ONBOARDING_STEPS.filter((step) => states[step.id] === 'done').length;

  return Math.round((done / ONBOARDING_STEPS.length) * 100);
}
