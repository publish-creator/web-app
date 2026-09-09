import type { PaginatedResponse, PaginationParams } from '../types';

export type BuyLinkType = 'DTC' | 'BUY_LINK';

export type BuyLink = {
  id: string;
  /** Public identifier of the link, separate from the offer's own code. */
  code: string;
  offerId: string;
  type: BuyLinkType;
  title: string;
  description: string | null;
  imageUrl: string | null;
  url: string;
  /** Decimal strings, like the offer's commission. `value` is the price; `cpa` the payout. */
  value: string;
  cpa: string | null;
  isAvailableForAllUsers: boolean;
  allowedUserIds: string[];
  createdAt: string;
  updatedAt: string;
};

/** Buy links come back whole, without a `meta` — the API does not page them. */
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
  /**
   * A signed URL the API mints per request, valid for a short window. Never cache it beyond the
   * response it came in, and never store it — it stops working.
   */
  url: string;
  createdAt: string;
  updatedAt: string;
};

export type OfferCreativesResponse = PaginatedResponse<OfferCreative>;

export type OfferSubListParams = PaginationParams & {
  filter?: string;
  order?: 'asc' | 'desc';
};
