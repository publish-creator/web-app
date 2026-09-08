import type { PaginatedResponse, PaginationParams } from '../types';

export type OfferStatus = 'DRAFT' | 'PUBLISHED' | 'INACTIVE';

export type CommissionType = 'CPA' | 'REV_SHARE';

export type CommissionMode = 'STANDARD' | 'ADVANCED';

export type PaymentPlatform = 'SPARK' | 'BUY_GOODS';

export type OfferPlatformRole =
  | 'AFFILIATE'
  | 'CO_PRODUCER'
  | 'PARTNER'
  | 'ROOT'
  | 'FINANCE'
  | 'ONBOARDING'
  | 'COMMERCIAL';

export type TaxonomyRef = {
  id: string;
  name: string;
};

export type OfferTag = {
  id: string;
  name: string;
  active: boolean;
  /**
   * Ids, not names. The write side of the API takes `userTags` as names and resolves them; reading
   * an offer back gives the ids they resolved to.
   */
  userTagIds: string[];
};

export type Offer = {
  id: string;
  /** Public identifier, `off_` plus a random suffix. Shown to people; `id` is internal. */
  code: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  status: OfferStatus;
  angle: string | null;
  currency: string | null;
  paymentPlatform: PaymentPlatform;
  /** ISO-3166 alpha-2, uppercase. Already the union of the explicit list and every country group. */
  countries: string[];
  countryGroupIds: string[];
  pvUrl: string | null;
  isAvailableForAllUsers: boolean;
  allowedPlatformRoles: OfferPlatformRole[];
  allowedUserIds: string[];
  tags: OfferTag[];
  category: TaxonomyRef | null;
  niche: TaxonomyRef | null;
  structure: TaxonomyRef | null;
  commissionMode: CommissionMode;
  frontCommissionType: CommissionType;
  /**
   * A decimal string, never a number: the column is `Decimal(12,2)` and the API serialises it as a
   * string so a float cannot round it on the way here. It is a plain amount, not cents — `100` means
   * one hundred — and with `REV_SHARE` it is a percentage rather than money.
   */
  frontCommissionValue: string;
  backCommissionType: CommissionType;
  backCommissionValue: string;
  recurrenceCommissionType: CommissionType;
  recurrenceCommissionValue: string;
  createdAt: string;
  updatedAt: string;
};

export type OfferOrderBy = 'createdAt' | 'updatedAt' | 'title' | 'status';

export type OffersListParams = PaginationParams & {
  /** Searches title, description and code, ignoring case. */
  filter?: string;
  orderBy?: OfferOrderBy;
  order?: 'asc' | 'desc';
};

export type OffersListResponse = PaginatedResponse<Offer>;
