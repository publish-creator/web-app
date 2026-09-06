'use client';

import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';

export function AuthSignUpContentSuccess() {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-center gap-8 text-center">
      <div className="flex max-w-[420px] flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Conta criada com sucesso!</h1>
        <p className="text-muted text-sm leading-relaxed">
          Sua conta está pronta. Agora você pode fazer login e começar a usar a plataforma.
        </p>
      </div>
      <div className="flex w-full max-w-[420px] flex-col gap-3">
        <Button fullWidth size="lg" onPress={() => router.push('/auth/sign-in')}>
          Ir para o login
        </Button>
        <p className="text-muted text-xs leading-relaxed">
          Use o e-mail cadastrado para acessar sua conta.
        </p>
      </div>
    </div>
  );
}
