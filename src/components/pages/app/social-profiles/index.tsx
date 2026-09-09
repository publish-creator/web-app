'use client';

import { useState } from 'react';

import { Button } from '@heroui/react';

import { SocialAccountCard } from '@/components/widgets/social-profiles/social-account-card';
import { SocialConnectPanel } from '@/components/widgets/social-profiles/social-connect-panel';
import { messageFromError } from '@/lib/api/error-message';
import {
  useDisconnectSocialAccountMutation,
  useGetConnectUrlMutation,
  useGetSocialAccountsQuery,
} from '@/store/services/social-accounts';
import type { SocialPlatform } from '@/store/services/social-accounts';

const GRID = 'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3';

export function SocialProfilesPage() {
  const accounts = useGetSocialAccountsQuery();
  const [getConnectUrl] = useGetConnectUrlMutation();
  const [disconnect, { isLoading: isDisconnecting }] = useDisconnectSocialAccountMutation();

  const [connecting, setConnecting] = useState<SocialPlatform | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const connect = async (platform: SocialPlatform) => {
    setError('');
    setConnecting(platform);

    try {
      const { url } = await getConnectUrl({ platform }).unwrap();

      window.location.href = url;
    } catch (cause) {
      setError(messageFromError(cause));
      setConnecting(null);
    }
  };

  const remove = async (id: string) => {
    setError('');
    setDisconnectingId(id);

    try {
      await disconnect(id).unwrap();
    } catch (cause) {
      setError(messageFromError(cause));
    } finally {
      setDisconnectingId(null);
    }
  };

  const list = accounts.data?.data ?? [];

  return (
    <div className="container-wrapper flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Social Profiles</h1>
          <p className="text-muted text-sm">
            As contas de Instagram e TikTok que a plataforma pode publicar por você.
          </p>
        </div>
        <Button
          isPending={accounts.isFetching}
          onPress={() => void accounts.refetch()}
          variant="tertiary"
        >
          Atualizar
        </Button>
      </div>

      <SocialConnectPanel connectingPlatform={connecting} onConnect={(p) => void connect(p)} />

      {error ? <p className="text-danger text-sm">{error}</p> : null}

      {accounts.isLoading ? (
        <div className={GRID}>
          {Array.from({ length: 3 }, (_, index) => (
            <div
              aria-hidden
              className="bg-surface-secondary h-52 animate-pulse rounded-xl"
              key={index}
            />
          ))}
        </div>
      ) : accounts.isError ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm font-medium">Não foi possível carregar suas contas.</p>
          <Button onPress={() => void accounts.refetch()} variant="secondary">
            Tentar novamente
          </Button>
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-sm font-medium">Nenhuma conta conectada.</p>
          <p className="text-muted max-w-96 text-sm">
            Conecte um Instagram ou TikTok acima para começar a publicar pela plataforma.
          </p>
        </div>
      ) : (
        <div className={GRID}>
          {list.map((account) => (
            <SocialAccountCard
              account={account}
              isDisconnecting={isDisconnecting && disconnectingId === account.id}
              key={account.id}
              onDisconnect={() => void remove(account.id)}
              onReconnect={() => void connect(account.platform)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
