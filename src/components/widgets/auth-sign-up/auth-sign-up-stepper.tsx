'use client';

import { Check } from '@gravity-ui/icons';

import { ProgressBar } from '@heroui/react';

import { SIGN_UP_STEPPER_GROUPS, getSignupProgress } from './auth-sign-up.constants';

export function AuthSignUpMobileProgress({ step }: { step: number }) {
  const progress = getSignupProgress(step);

  return (
    <div className="mx-auto mb-4 w-full max-w-[550px] px-8 lg:hidden">
      <ProgressBar aria-label="Progresso do cadastro" className="w-full" size="sm" value={progress}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-muted text-xs">Progresso</span>
          <ProgressBar.Output className="text-xs font-semibold" />
        </div>
        <ProgressBar.Track>
          <ProgressBar.Fill />
        </ProgressBar.Track>
      </ProgressBar>
    </div>
  );
}

export function AuthSignUpStepper({ step }: { step: number }) {
  return (
    <nav
      aria-label="Etapas do cadastro"
      className="absolute top-0 left-0 z-10 hidden h-full w-[268px] flex-col pt-10 pl-8 lg:flex"
    >
      {SIGN_UP_STEPPER_GROUPS.map((group, index) => {
        const stepNumber = index + 1;
        const isFirst = index === 0;
        const isLast = index === SIGN_UP_STEPPER_GROUPS.length - 1;
        const isCompleted = step > group.completedAfter;
        const isActive = group.steps.includes(step);
        const previousGroup = index > 0 ? SIGN_UP_STEPPER_GROUPS[index - 1] : undefined;
        const isLineBeforeCompleted = Boolean(previousGroup && step > previousGroup.completedAfter);

        return (
          <div
            aria-current={isActive ? 'step' : undefined}
            className="flex w-full gap-3 text-left"
            key={group.key}
          >
            <div className="flex w-8 shrink-0 flex-col items-center">
              <div
                className={`w-0.5 flex-1 ${
                  isFirst ? 'bg-transparent' : isLineBeforeCompleted ? 'bg-accent' : 'bg-border'
                }`}
              />
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                  isCompleted
                    ? 'border-accent bg-accent text-accent-foreground'
                    : isActive
                      ? 'border-accent text-accent'
                      : 'border-border text-muted'
                }`}
              >
                {isCompleted ? <Check className="size-4" /> : stepNumber}
              </div>
              <div
                className={`min-h-6 w-0.5 flex-1 ${
                  isLast ? 'bg-transparent' : isCompleted ? 'bg-accent' : 'bg-border'
                }`}
              />
            </div>
            <div className="flex min-w-0 flex-col gap-0.5 py-1.5 pb-6">
              <span
                className={`text-sm leading-tight font-semibold ${
                  isActive || isCompleted ? 'text-foreground' : 'text-muted'
                }`}
              >
                {group.label}
              </span>
              <span className="text-muted text-xs leading-tight">{group.subtitle}</span>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
