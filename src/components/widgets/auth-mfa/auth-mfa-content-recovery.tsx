'use client';

import { ArrowDownToLine, Copy } from '@gravity-ui/icons';

import { useState } from 'react';

import { Button, Card, ErrorMessage } from '@heroui/react';

import { useAuthMfa } from './auth-mfa-context';
import { RECOVERY_FILE_NAME, recoveryCodesFile } from './auth-mfa-recovery-file';

export function AuthMfaContentRecovery() {
  const { recoveryCodes } = useAuthMfa();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const hasCodes = recoveryCodes.length > 0;

  const copyCodes = async () => {
    try {
      await navigator.clipboard.writeText(recoveryCodes.join('\n'));
      setCopyError('');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError('Não foi possível copiar. Baixe o arquivo ou anote os códigos.');
    }
  };

  const downloadCodes = () => {
    const blob = new Blob([recoveryCodesFile(recoveryCodes, new Date())], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = RECOVERY_FILE_NAME;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-accent text-xs font-semibold tracking-[0.14em]">
          SEGURANÇA EM PRIMEIRO LUGAR
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Códigos de recuperação</h1>
        <p className="text-muted max-w-2xl text-sm leading-relaxed">
          Estes códigos aparecem uma única vez. Baixe ou copie agora e guarde em um local seguro:
          cada um funciona uma vez e é o que devolve o acesso à sua conta se você perder o
          autenticador. Nada consegue exibi-los de novo.
        </p>
      </div>

      <Card>
        <Card.Content className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {recoveryCodes.map((recoveryCode) => (
              <code
                className="bg-surface-secondary rounded-xl px-3 py-2 text-center text-sm tracking-wide"
                key={recoveryCode}
              >
                {recoveryCode}
              </code>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="flex-1"
              isDisabled={!hasCodes}
              onPress={downloadCodes}
              variant="secondary"
            >
              <ArrowDownToLine className="size-4" />
              Baixar arquivo
            </Button>
            <Button
              className="flex-1"
              isDisabled={!hasCodes}
              onPress={() => void copyCodes()}
              variant="secondary"
            >
              <Copy className="size-4" />
              {copied ? 'Códigos copiados' : 'Copiar códigos'}
            </Button>
          </div>

          {copyError ? <ErrorMessage>{copyError}</ErrorMessage> : null}
        </Card.Content>
      </Card>
    </div>
  );
}
