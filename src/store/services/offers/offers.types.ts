import type { PaginatedResponse, PaginationParams } from '../types';

export type CommissionType = 'CPA' | 'REV_SHARE';

export type OfferStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';

export type AffiliateRole = 'NONE' | 'AFFILIATE' | 'PARTNER';

export type Offer = {
  commissionType: string;
  commissionValue: number;
  pvUrl: string;
  kind: string;
  request: [
    {
      sessions: number;
      visitors: number;
      pageViews: number;
      initiatedCheckouts: number;
      clicks: number;
      totalSales: number;
      totalPaidSales: number;
      addPaymentInfo: number;
      addToCart: number;
      totalCommissionGross: number;
      totalCommissionNet: number;
      createdAt: string;
      updatedAt: string;
      commissionType: CommissionType;
      commissionValue: number;
      backCommissionType: CommissionType;
      backCommissionValue: number;
      subscriptionCommissionType: CommissionType;
      subscriptionCommissionValue: number;
      partnerAffiliate: {
        user: {
          name: string;
          id: string;
          code: string;
          email: string;
          phone: string;
          avatar: {
            url: string;
          };
        };
      };
      id: string;
      offerId: string;
      status: OfferStatus;
      code: string;
      userId: string;
      affiliateRole: AffiliateRole;
      timeOnPage: number;
      partnerAffiliateId: string;
    },
  ];
  isFavorite: true;
  totalVsl: number;
  allowedUsers: [
    {
      id: string;
      name: string;
      avatar: string;
    },
  ];
  id: string;
  code: string;
  status: string;
  title: string;
  description: string;
  category: {
    id: string;
    title: string;
  };
  allowedPlatformRoles: [string];
  country: [string];
  typeId: string;
  type: string;
  currency: string;
  backCommissionType: CommissionType;
  backCommissionValue: number;
  subscriptionCommissionType: CommissionType;
  subscriptionCommissionValue: number;
  isAvailableForAllUsers: true;
  totalClicks: number;
  affiliates: number;
  rating: number;
  file: string;
  createdAt: string;
  updatedAt: string;
};

export type OffersListParams = PaginationParams & {
  filter?: string;
  /** Mapped from URL `status` (e.g. active, inactive). */
  status?: string;
};

export type OffersListResponse = PaginatedResponse<Offer>;
