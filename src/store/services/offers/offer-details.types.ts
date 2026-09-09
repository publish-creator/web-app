import type { PaginatedResponse, PaginationParams } from '../types';

export type BuyLinkType = 'DTC' | 'BUY_LINK';

export type BuyLink = {
  id: string;

  code: string;
  offerId: string;
  type: BuyLinkType;
  title: string;
  description: string | null;
  imageUrl: string | null;
  url: string;

  value: string;
  cpa: string | null;
  isAvailableForAllUsers: boolean;
  allowedUserIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type BuyLinksResponse = { data: BuyLink[] };

export type OfferCreativeKind = 'IMAGE' | 'VIDEO';

export type OfferCreative = {
  id: string;
  offerId: string;
  kind: OfferCreativeKind;
  title: string;
  description: string | null;
  uploadId: string;
  sortOrder: number;
  mimeType: string;
  sizeBytes: number;

  url: string;
  createdAt: string;
  updatedAt: string;
};

export type OfferCreativesResponse = PaginatedResponse<OfferCreative>;

export type OfferSubListParams = PaginationParams;
