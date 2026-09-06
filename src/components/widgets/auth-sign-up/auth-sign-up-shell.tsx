'use client';

import { Link } from '@heroui/react';

import { useAuthSignUp } from './auth-sign-up-context';
import { AuthSignUpContent } from './auth-sign-up-content';
import { AuthSignUpHeader } from './auth-sign-up-header';
import { AuthSignUpIllustration } from './auth-sign-up-illustration';
import { AuthSignUpMobileProgress, AuthSignUpStepper } from './auth-sign-up-stepper';
import { SIGN_UP_STEP_MAX_WIDTH } from './auth-sign-up.constants';

export function AuthSignUpShell() {
  const { step } = useAuthSignUp();
  const showStepper = step > 2 && step < 8;
  const maxWidth = SIGN_UP_STEP_MAX_WIDTH[step] ?? SIGN_UP_STEP_MAX_WIDTH[1];

  return (
    <div className="auth-sign-up-bg bg-background text-foreground relative flex min-h-screen w-full flex-col">
      <div className="from-background/80 pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-linear-to-b to-transparent" />

      <div className="relative z-20 flex min-h-screen w-full flex-col">
        <AuthSignUpHeader />

        <div className="relative flex flex-1 grow flex-col pt-6 md:pt-10">
          {showStepper ? <AuthSignUpMobileProgress step={step} /> : null}
          {showStepper ? <AuthSignUpStepper step={step} /> : null}

          <div className="flex w-full flex-1 justify-center overflow-x-hidden px-8 pb-10">
            <div className={`flex w-full flex-col items-center gap-6 ${maxWidth}`}>
              <AuthSignUpIllustration step={step} />
              <div className="w-full">
                <AuthSignUpContent />
              </div>
            </div>
          </div>
        </div>

        <footer className="hidden flex-col items-center justify-center gap-1 py-4 text-center md:flex">
          <p className="text-muted text-xs">Você precisa ter 18 anos ou mais para criar uma conta.</p>
          <p className="text-muted text-xs">
            © 2026 - Todos os direitos reservados |{' '}
            <Link className="text-muted text-xs no-underline" href="#">
              Termos
            </Link>{' '}
            |{' '}
            <Link className="text-muted text-xs no-underline" href="#">
              Privacidade
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
