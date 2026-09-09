import type { SocialAccountStatus, SocialPlatform } from '@/store/services/social-accounts';

export const PLATFORMS: { id: SocialPlatform; label: string }[] = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
];

export const PLATFORM_LABEL: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
};

type StatusPresentation = {
  label: string;
  color: 'success' | 'warning' | 'danger';
  hint: string;
};

export const STATUS: Record<SocialAccountStatus, StatusPresentation> = {
  active: {
    label: 'Conectada',
    color: 'success',
    hint: 'Publicações e métricas funcionando normalmente.',
  },
  expiring: {
    label: 'Expirando',
    color: 'warning',
    hint: 'O acesso vence em breve. Reconecte para não perder as publicações agendadas.',
  },
  reconnectRequired: {
    label: 'Reconecte',
    color: 'danger',
    hint: 'O acesso caiu. Nada é publicado por esta conta até você reconectar.',
  },
};

export function formatHandle(username: string | null, externalAccountId: string): string {
  return username ? `@${username}` : externalAccountId;
}
