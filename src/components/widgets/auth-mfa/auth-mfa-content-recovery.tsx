'use client';

import { useState } from 'react';

import { Button, Card } from '@heroui/react';

import { MFA_RECOVERY_CODES } from './auth-mfa.constants';

export function AuthMfaContentRecovery() {
  const [copied, setCopied] = useState(false);

  const copyCodes = async () => {
    await navigator.clipboard.writeText(MFA_RECOVERY_CODES.join('\n'));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-accent text-xs font-semibold tracking-[0.14em]">
          SEGURANÇA EM PRIMEIRO LUGAR
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Códigos de recuperação</h1>
        <p className="text-muted max-w-2xl text-sm leading-relaxed">
          Após confirmar, você receberá códigos de recuperação de uso único. Guarde-os em um local
          seguro. Cada código funciona uma única vez se você perder o acesso ao autenticador.
        </p>
      </div>

      <Card>
        <Card.Content className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {MFA_RECOVERY_CODES.map((recoveryCode) => (
              <code
                className="bg-surface-secondary rounded-xl px-3 py-2 text-center text-sm tracking-wide"
                key={recoveryCode}
              >
                {recoveryCode}
              </code>
            ))}
          </div>
          <Button variant="secondary" onPress={() => void copyCodes()}>
            {copied ? 'Códigos copiados' : 'Copiar códigos'}
          </Button>
        </Card.Content>
      </Card>
    </div>
  );
}
