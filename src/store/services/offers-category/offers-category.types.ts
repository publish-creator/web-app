import type { PaginatedResponse, PaginationParams } from '../types';

export type OffersCategory = {
  title: string;
  titlePt: string;
  offers: number;
  image: {
    id: string;
    url: string;
  };
  _count: {
    offers: number;
  };
  id: string;
  titleEn: string;
  icon: string;
  score: number;
  scoreLabel: string;
  bestCPA: number;
  totalClicks: number;
  totalAffiliates: number;
  createdAt: string;
  updatedAt: string;
};

export type OffersCategoryListParams = PaginationParams & {
  filter?: string;
  /** Mapped from URL `status` (e.g. active, inactive). */
  status?: string;
};

export type OffersCategoryListResponse = PaginatedResponse<OffersCategory>;
