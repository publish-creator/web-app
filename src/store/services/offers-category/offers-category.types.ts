import type { PaginatedResponse, PaginationParams } from '../types';

/**
 * A category from `GET /settings/categories`. The v2 API carries no counters, score or image on a
 * category — `name` is already resolved to the language the request asked for, and `namePt`/`nameEn`
 * are the raw columns behind it.
 */
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
