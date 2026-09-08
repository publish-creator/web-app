'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@heroui/react';

import { useAuthSignUp } from './auth-sign-up-context';

export function AuthSignUpContentSuccess() {
  const router = useRouter();
  const { data } = useAuthSignUp();

  return (
    <div className="flex w-full flex-col items-center gap-8 text-center">
      <div className="flex max-w-[420px] flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Confira seu e-mail</h1>
        <p className="text-muted text-sm leading-relaxed">
          Enviamos um link de acesso para <strong>{data.email}</strong>. Abra-o para entrar e
          definir sua senha. O link vale por 15 minutos.
        </p>
      </div>
      <div className="flex w-full max-w-[420px] flex-col gap-3">
        <Button fullWidth onPress={() => router.push('/auth/sign-in')} size="lg">
          Ir para o login
        </Button>
        <p className="text-muted text-xs leading-relaxed">
          Não recebeu? Verifique a caixa de spam antes de pedir um novo link.
        </p>
      </div>
    </div>
  );
}
