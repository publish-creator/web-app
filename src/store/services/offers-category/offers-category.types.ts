import type { PaginatedResponse, PaginationParams } from '../types';

export type OffersCategory = {
  id: string;
  name: string;
  namePt: string;
  nameEn: string | null;
  description: string | null;
  icon: string | null;
  sortOrder: number;
};

export type OffersCategoryOrderBy = 'sortOrder' | 'namePt' | 'nameEn' | 'createdAt' | 'updatedAt';

export type OffersCategoryListParams = PaginationParams & {
  filter?: string;
  orderBy?: OffersCategoryOrderBy;
  order?: 'asc' | 'desc';
};

export type OffersCategoryListResponse = PaginatedResponse<OffersCategory>;
