'use client';

import { Link } from '@heroui/react';

import { AuthFlowHeader } from '@/widgets/auth';

export function AuthSignUpHeader() {
  return (
    <AuthFlowHeader
      action={
        <p className="text-muted text-xs font-medium">
          Já possui conta?{' '}
          <Link className="text-accent text-xs font-medium no-underline" href="/auth/sign-in">
            Entrar
          </Link>
        </p>
      }
    />
  );
}
