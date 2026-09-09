'use client';

import { Button, Card } from '@heroui/react';

import { InstagramIcon, TikTokIcon } from '@/components/base/icons-svg';
import type { SocialPlatform } from '@/store/services/social-accounts';

import { PLATFORMS } from './social-platform';

interface SocialConnectPanelProps {
  connectingPlatform: SocialPlatform | null;
  onConnect: (platform: SocialPlatform) => void;
}

export function SocialConnectPanel({ connectingPlatform, onConnect }: SocialConnectPanelProps) {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <div>
        <p className="text-base font-semibold">Conectar uma conta</p>
        <p className="text-muted text-sm">
          Você será levado para a plataforma para autorizar o acesso. Ao voltar, atualize esta
          página.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((platform) => (
          <Button
            isPending={connectingPlatform === platform.id}
            key={platform.id}
            onPress={() => onConnect(platform.id)}
            variant="secondary"
          >
            {platform.id === 'instagram' ? <InstagramIcon /> : <TikTokIcon />}
            {platform.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
