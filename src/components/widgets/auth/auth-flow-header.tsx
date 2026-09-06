'use client';

import { ThemeSwitcher } from '@/widgets/shared/theme-switcher';
import Image from 'next/image';

import type { ReactNode } from 'react';

interface AuthFlowHeaderProps {
  action?: ReactNode;
}

export function AuthFlowHeader({ action }: AuthFlowHeaderProps) {
  return (
    <header className="mx-auto flex h-16 w-full items-center justify-between px-8">
      <div className="relative h-10 w-40 max-w-40">
        <Image alt="Logo" fill src="/images/markepublish-logo-invert.svg" />
      </div>
      <div className="flex items-center gap-3">
        {action}
        <ThemeSwitcher />
      </div>
    </header>
  );
}
