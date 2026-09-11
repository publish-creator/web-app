import type { PaginatedResponse, PaginationParams } from '../types';

export type Taxonomy = {
  id: string;
  name: string;
  namePt: string;
  nameEn: string | null;
  description: string | null;
  sortOrder: number;
};

export type TaxonomyListParams = PaginationParams & {
  filter?: string;
  order?: 'asc' | 'desc';
};

export type TaxonomyListResponse = PaginatedResponse<Taxonomy>;
