export type SocialPlatform = 'instagram' | 'tiktok';

export type SocialAccountStatus = 'active' | 'expiring' | 'reconnectRequired';

export type SocialAccount = {
  id: string;
  platform: SocialPlatform;
  status: SocialAccountStatus;
  externalAccountId: string;
  username: string | null;
  accountType: string | null;
  tokenExpiresAt: string | null;
  connectedByRef: string | null;
  createdAt: string;
};

export type SocialAccountsResponse = { data: SocialAccount[] };

export type ConnectUrlParams = {
  platform: SocialPlatform;
  redirectTo?: string;
  externalRef?: string;
};

export type ConnectUrlResponse = {
  platform: SocialPlatform;
  url: string;
  state: string;
  expiresAt: string;
};

export type DisconnectResponse = { id: string; disconnected: true };
