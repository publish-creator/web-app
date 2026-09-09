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

  userTagIds: string[];
};

export type Offer = {
  id: string;

  code: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  status: OfferStatus;
  angle: string | null;
  currency: string | null;
  paymentPlatform: PaymentPlatform;

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
  filter?: string;
  orderBy?: OfferOrderBy;
  order?: 'asc' | 'desc';
};

export type OffersListResponse = PaginatedResponse<Offer>;
