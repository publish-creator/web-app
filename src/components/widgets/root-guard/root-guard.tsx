'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { Spinner } from '@heroui/react';

import { ROOT_FALLBACK_ROUTE, rootAccessFor } from '@/lib/auth/root-access';
import { useGetSessionQuery } from '@/store/services/auth';

export function RootGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session, isSuccess } = useGetSessionQuery();
  const access = rootAccessFor(session?.user ?? null, isSuccess);

  useEffect(() => {
    if (access === 'redirect') router.replace(ROOT_FALLBACK_ROUTE);
  }, [access, router]);

  if (access !== 'allow') {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3">
        <Spinner className="size-6" />
        <p className="text-muted text-sm">Verificando seu acesso…</p>
      </div>
    );
  }

  return <>{children}</>;
}
