'use client';

import { Check } from '@gravity-ui/icons';

import { usePathname } from 'next/navigation';

import { ProgressBar } from '@heroui/react';

import { useGetSessionQuery } from '@/store/services/auth';

import { ONBOARDING_STEPS, onboardingProgress, stepStates } from './auth-onboarding-steps';

function useStates() {
  const pathname = usePathname();
  const { data: session } = useGetSessionQuery();

  return stepStates(session?.pending, pathname ?? '');
}

export function AuthOnboardingProgress({ className }: { className?: string } = {}) {
  const states = useStates();
  const progress = onboardingProgress(states);

  return (
    <div className={className ?? 'mx-auto mb-4 w-full max-w-[550px] px-8 lg:hidden'}>
      <ProgressBar
        aria-label="Progresso da criação de conta"
        className="w-full"
        size="sm"
        value={progress}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-muted text-xs">Criando sua conta</span>
          <ProgressBar.Output className="text-xs font-semibold" />
        </div>
        <ProgressBar.Track>
          <ProgressBar.Fill />
        </ProgressBar.Track>
      </ProgressBar>
    </div>
  );
}

export function AuthOnboardingStepper() {
  const states = useStates();

  return (
    <nav
      aria-label="Etapas para criar sua conta"
      className="absolute top-0 left-0 z-10 hidden h-full w-[268px] flex-col pt-10 pl-8 lg:flex"
    >
      {ONBOARDING_STEPS.map((step, index) => {
        const state = states[step.id];
        const isFirst = index === 0;
        const isLast = index === ONBOARDING_STEPS.length - 1;
        const previous = index > 0 ? ONBOARDING_STEPS[index - 1] : undefined;
        const isLineBeforeDone = Boolean(previous && states[previous.id] === 'done');

        return (
          <div
            aria-current={state === 'current' ? 'step' : undefined}
            className="flex w-full gap-3 text-left"
            key={step.id}
          >
            <div className="flex w-8 shrink-0 flex-col items-center">
              <div
                className={`w-0.5 flex-1 ${
                  isFirst ? 'bg-transparent' : isLineBeforeDone ? 'bg-accent' : 'bg-border'
                }`}
              />
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                  state === 'done'
                    ? 'border-accent bg-accent text-accent-foreground'
                    : state === 'current'
                      ? 'border-accent text-accent'
                      : 'border-border text-muted'
                }`}
              >
                {state === 'done' ? <Check className="size-4" /> : index + 1}
              </div>
              <div
                className={`min-h-6 w-0.5 flex-1 ${
                  isLast ? 'bg-transparent' : state === 'done' ? 'bg-accent' : 'bg-border'
                }`}
              />
            </div>
            <div className="flex min-w-0 flex-col gap-0.5 py-1.5 pb-6">
              <span
                className={`text-sm leading-tight font-semibold ${
                  state === 'upcoming' ? 'text-muted' : 'text-foreground'
                }`}
              >
                {step.label}
              </span>
              <span className="text-muted text-xs leading-tight">{step.subtitle}</span>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
