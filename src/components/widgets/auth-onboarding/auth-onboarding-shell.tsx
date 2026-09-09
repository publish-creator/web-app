'use client';

import type { ReactNode } from 'react';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { Link } from '@heroui/react';

import { AuthFlowHeader } from '@/widgets/auth';

import { AuthOnboardingProgress, AuthOnboardingStepper } from './auth-onboarding-stepper';
import { stepForPath } from './auth-onboarding-steps';

function AuthOnboardingIllustration() {
  const pathname = usePathname();
  const illustration = stepForPath(pathname ?? '')?.illustration;

  if (!illustration) {
    return <Image alt="Logo" height={104} src="/images/markepublish-icone.svg" width={104} />;
  }

  return <Image alt={illustration.alt} height={160} src={illustration.src} width={160} />;
}

export function AuthOnboardingShell({
  children,
  action,
  width = 'max-w-[500px]',
}: {
  children: ReactNode;
  action?: ReactNode;
  width?: string;
}) {
  return (
    <div className="auth-sign-up-bg bg-background text-foreground relative flex min-h-screen w-full flex-col">
      <div className="from-background/80 pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-linear-to-b to-transparent" />

      <div className="relative z-20 flex min-h-screen w-full flex-col">
        <AuthFlowHeader
          action={
            action ?? (
              <Link className="text-accent text-xs font-medium no-underline" href="/auth/sign-in">
                Sair
              </Link>
            )
          }
        />

        <div className="relative flex flex-1 grow flex-col pt-6 md:pt-10">
          <AuthOnboardingProgress />
          <AuthOnboardingStepper />

          <div className="flex w-full flex-1 justify-center overflow-x-hidden px-8 pb-10">
            <div className={`flex w-full ${width} flex-col items-center gap-6`}>
              <AuthOnboardingIllustration />
              <div className="w-full">{children}</div>
            </div>
          </div>
        </div>

        <footer className="hidden flex-col items-center justify-center gap-1 py-4 text-center md:flex">
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
