import type { PaginatedResponse, PaginationParams } from '../types';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  customer: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
};

export type OrdersListParams = PaginationParams & {
  status?: OrderStatus;
};

export type OrdersListResponse = PaginatedResponse<Order>;

export type UpdateOrderStatusDto = {
  id: string;
  status: OrderStatus;
};

export type OrdersConversionGraph = {
  graphTotal: number;
  graph: [
    {
      valueNet: number;
      conversions: number;
      checkoutViews: number;
      date: string;
    },
  ];
  totalValueNet: number;
  totalConversions: number;
  totalCheckoutViews: number;
};

export type OrdersMetrics = {
  totalGross: number;
  totalNet: number;
  totalSales: number;
  profitPercentage: string;
  aov: number;
  affiliateNetworkValue: number;
  salesFrequency: {
    value: string;
    unit: string;
  };
  lastSaleAt: string;
};
