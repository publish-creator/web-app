'use client';

import { ArrowRight } from '@gravity-ui/icons';
import { Logout2Icon } from '@solar-icons/react/bold';

import { Button } from '@heroui/react';

import { useSession } from '@/providers/session-provider';

import { useAuthMfa } from './auth-mfa-context';

export function AuthMfaFooter() {
  const { onSignOut, isLoading } = useSession();
  const { step, code, activate, finish, isActivating } = useAuthMfa();
  const isSetup = step === 1;

  return (
    <footer className="mx-auto flex w-full max-w-360 shrink-0 items-start justify-between gap-6 px-20 py-5">
      <Button isPending={isLoading} onPress={onSignOut} variant="secondary">
        <Logout2Icon className="size-4" />
        Sair com segurança
      </Button>

      <div className="flex max-w-80 flex-col items-center gap-2">
        {isSetup ? (
          <Button
            isDisabled={code.length !== 6}
            isPending={isActivating}
            onPress={activate}
            size="lg"
          >
            Ativar e continuar
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onPress={finish} size="lg">
            Guardei meus códigos, continuar
            <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </footer>
  );
}
