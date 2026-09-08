'use client';

import { useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button, Checkbox, ErrorMessage, ProgressBar, Spinner } from '@heroui/react';

import { messageFromError } from '@/lib/api/error-message';
import { nextRouteFor } from '@/lib/auth/pending-route';
import {
  useLazyGetSessionQuery,
  useTermsAcceptMutation,
  useTermsCurrentQuery,
} from '@/store/services/auth';

import { AuthOnboardingShell } from './auth-onboarding-shell';
import { useTermsEvidence } from './use-terms-evidence';

export function AuthAcceptTerms() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const { data: terms, isLoading, error: loadError } = useTermsCurrentQuery();
  const [acceptTerms, { isLoading: isAccepting }] = useTermsAcceptMutation();
  const [loadSession] = useLazyGetSessionQuery();

  const { scrollDepthPercent, reachedEnd, onScroll, collect } = useTermsEvidence(scrollRef);

  const accept = async () => {
    if (!terms) return;

    setError('');

    try {
      await acceptTerms({ termsVersionId: terms.id, ...collect() }).unwrap();

      const session = await loadSession().unwrap();

      router.push(nextRouteFor(session));
    } catch (cause) {
      setError(messageFromError(cause));
    }
  };

  return (
    <AuthOnboardingShell width="max-w-[720px]">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Termos de uso</h1>
          <p className="text-muted text-sm leading-relaxed">
            {terms
              ? `Versão ${terms.version}. Leia até o fim para continuar.`
              : 'Carregando a versão vigente…'}
          </p>
        </div>

        <ProgressBar
          aria-label="Progresso da leitura"
          className="w-full"
          size="sm"
          value={scrollDepthPercent}
        >
          <ProgressBar.Track>
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </ProgressBar>

        <div
          className="bg-surface-secondary h-96 w-full overflow-y-auto rounded-xl p-6"
          onScroll={onScroll}
          ref={scrollRef}
        >
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner className="size-6" />
            </div>
          ) : terms ? (
            /**
             * The text is served by the API, not bundled with the front. Rendering it in an iframe
             * keeps whatever it contains from executing as part of this page — and a version whose
             * markup could run scripts here would be a very expensive way to lose a session.
             */
            <iframe
              className="h-full w-full border-0"
              sandbox=""
              src={terms.url}
              title={`Termos de uso versão ${terms.version}`}
            />
          ) : (
            <p className="text-muted text-sm">{messageFromError(loadError)}</p>
          )}
        </div>

        <Checkbox
          isDisabled={!reachedEnd}
          isSelected={agreed}
          onChange={setAgreed}
          variant="secondary"
        >
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content className="text-sm">
            Li e concordo com os termos de uso
            {reachedEnd ? '' : ' (role até o fim para habilitar)'}
          </Checkbox.Content>
        </Checkbox>

        {error ? <ErrorMessage>{error}</ErrorMessage> : null}

        <Button
          fullWidth
          isDisabled={!agreed || !terms}
          isPending={isAccepting}
          onPress={() => void accept()}
          size="lg"
        >
          Aceitar e continuar
        </Button>
      </div>
    </AuthOnboardingShell>
  );
}
