'use client';

import type { ReactNode } from 'react';

import Image from 'next/image';

import { Link } from '@heroui/react';

import { AuthFlowHeader } from '@/widgets/auth';

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
    <div className="auth-sign-in-bg bg-background text-foreground relative flex min-h-screen w-full flex-col">
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

        <div className="relative flex flex-1 grow flex-col justify-center pt-6 md:pt-10">
          <div className="flex w-full flex-1 justify-center overflow-x-hidden px-8 pb-10">
            <div className={`flex w-full ${width} flex-col items-center gap-6`}>
              <Image alt="Logo" height={104} src="/images/markepublish-icone.svg" width={104} />
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
