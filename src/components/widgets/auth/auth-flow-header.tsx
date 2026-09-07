'use client';

import { ThemeSwitcher } from '@/widgets/shared/theme-switcher';
import Image from 'next/image';
import { cn } from '@heroui/react';

import type { ReactNode } from 'react';

interface AuthFlowHeaderProps {
  action?: ReactNode;
  className?: string;
}

export function AuthFlowHeader({ action, className }: AuthFlowHeaderProps) {
  return (
    <header
      className={cn('mx-auto flex h-16 w-full items-center justify-between px-8', className)}
    >
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
