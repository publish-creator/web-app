'use client';

import { useRouter } from 'next/navigation';

import { ArrowRight } from '@gravity-ui/icons';
import { Logout2Icon } from '@solar-icons/react/bold';
import { Button } from '@heroui/react';

import { useSession } from '@/providers/session-provider';

import { useAuthMfa } from './auth-mfa-context';

export function AuthMfaFooter() {
  const router = useRouter();
  const { onSignOut, isLoading } = useSession();
  const { step, code, activate } = useAuthMfa();
  const isSetup = step === 1;

  return (
    <footer className="mx-auto flex w-full max-w-360 shrink-0 items-start justify-between gap-6 px-20 py-5">
      <Button isPending={isLoading} onPress={onSignOut} variant="secondary">
        <Logout2Icon className="size-4" />
        Sair com segurança
      </Button>

      <div className="flex max-w-80 flex-col items-center gap-2">
        {isSetup ? (
          <Button isDisabled={code.length !== 6} onPress={activate} size="lg">
            Ativar e continuar
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onPress={() => router.push('/')} size="lg">
            Continuar
            <ArrowRight className="size-4" />
          </Button>
        )}
        {/* <p className="text-muted text-center text-xs leading-relaxed">
          {isSetup
            ? 'Após confirmar, você receberá códigos de recuperação de uso único.'
            : 'Guarde os códigos em um local seguro antes de continuar.'}
        </p> */}
      </div>
    </footer>
  );
}
