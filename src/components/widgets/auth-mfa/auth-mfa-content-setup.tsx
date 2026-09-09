'use client';

import { Clock } from '@gravity-ui/icons';
import { CopyBoldIcon } from '@solar-icons/react';
import { ShareIcon } from '@solar-icons/react/bold';
import { InfoCircleIcon } from '@solar-icons/react/linear';

import { useState } from 'react';

import { Card, Chip, ErrorMessage, InputOTP, Link } from '@heroui/react';

import { IconButton } from '@/components/base/icon-button';

import { useAuthMfa } from './auth-mfa-context';
import { AuthMfaQrCode } from './auth-mfa-qr-code';

export function AuthMfaContentSetup() {
  const { code, error, isPreparing, otpauthUrl, secret, setCode } = useAuthMfa();
  const [copied, setCopied] = useState(false);

  const copySecret = async () => {
    if (!secret) return;

    await navigator.clipboard.writeText(secret);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-accent text-xs font-semibold tracking-[0.14em]">
          SEGURANÇA EM PRIMEIRO LUGAR
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Proteja sua conta com autenticação em duas etapas
        </h1>
        <p className="text-muted max-w-2xl text-sm leading-relaxed">
          Antes de iniciar a ativação da sua conta, configure um aplicativo autenticador. Essa
          camada adicional ajuda a impedir acessos e operações não autorizadas, mesmo que sua senha
          seja comprometida.
        </p>
        <Chip className="w-fit" color="accent" variant="tertiary">
          <InfoCircleIcon className="size-3.5" />
          <Chip.Label>Obrigatório para continuar</Chip.Label>
        </Chip>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>1. Conecte seu aplicativo autenticador</Card.Title>
          <Card.Description>
            Abra o Google Authenticator, Microsoft Authenticator, Authy ou outro aplicativo
            compatível com TOTP e escaneie o QR Code.
          </Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col gap-4 md:flex-row md:items-start">
          {otpauthUrl ? (
            <AuthMfaQrCode otpauthUrl={otpauthUrl} />
          ) : (
            <div
              aria-label={isPreparing ? 'Gerando QR Code' : 'QR Code indisponível'}
              className="size-44 shrink-0 animate-pulse rounded-xl bg-white/10"
              role="img"
            />
          )}
          <div className="flex flex-1 flex-col gap-3">
            <p className="text-sm font-medium">
              Não consegue escanear? Insira esta chave manualmente
            </p>
            <div className="bg-surface-secondary flex items-center justify-between gap-2 rounded-xl px-3 py-2">
              <code className="text-sm tracking-wide">{secret ?? '••••••••••••••••'}</code>
              <IconButton
                isDisabled={!secret}
                label={copied ? 'Chave copiada' : 'Copiar chave'}
                onPress={() => void copySecret()}
                size="sm"
                variant="tertiary"
              >
                <CopyBoldIcon className="size-4" />
              </IconButton>
            </div>
            <p className="text-muted text-xs">
              Tipo: baseado em tempo (TOTP) - 6 dígitos - 30 segundos
            </p>
            <Link
              className="text-accent inline-flex items-center gap-1 text-sm no-underline"
              href="#"
            >
              Como configurar no meu aplicativo?
              <ShareIcon className="size-3.5" />
            </Link>
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>2. Confirme o código</Card.Title>
          <Card.Description>Digite o código de 6 dígitos exibido no aplicativo.</Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col gap-4">
          <InputOTP
            aria-label="Código do autenticador"
            maxLength={6}
            onChange={setCode}
            value={code}
            variant="secondary"
          >
            <InputOTP.Group className="justify-start gap-2">
              {Array.from({ length: 6 }, (_, index) => (
                <InputOTP.Slot className="size-12" index={index} key={index} />
              ))}
            </InputOTP.Group>
          </InputOTP>
          {error ? <ErrorMessage>{error}</ErrorMessage> : null}
          <p className="text-muted flex items-center gap-2 text-xs">
            <Clock className="size-4" />O código é atualizado a cada 30 segundos
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
