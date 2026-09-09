'use client';

import { ShareIcon } from '@solar-icons/react/bold';
import { AltArrowLeftIcon } from '@solar-icons/react/linear';

import { useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { Button, Tabs } from '@heroui/react';

import { useOfferId } from './use-offer';

export const OfferHeader = () => {
  const id = useOfferId();
  const router = useRouter();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const share = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between">
      <Button onPress={() => router.push('/offers')} variant="ghost">
        <AltArrowLeftIcon />
        Ofertas
      </Button>
      <div className="flex items-center gap-2">
        <Tabs selectedKey={pathname}>
          <Tabs.ListContainer>
            <Tabs.List aria-label="Seções da oferta">
              <Tabs.Tab href={`/offers/${id}`} id={`/offers/${id}`}>
                Detalhes
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab href={`/offers/${id}/metrics`} id={`/offers/${id}/metrics`}>
                Métricas
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab href={`/offers/${id}/publications`} id={`/offers/${id}/publications`}>
                Publicações
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
        <Button onPress={() => void share()} variant="tertiary">
          <ShareIcon />
          {copied ? 'Link copiado' : 'Compartilhar'}
        </Button>
      </div>
    </div>
  );
};
