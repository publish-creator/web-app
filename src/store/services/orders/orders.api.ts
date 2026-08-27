import { api } from '../api/base-api';
import type { OrdersConversionGraph, OrdersMetrics } from './orders.types';

export const ordersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOrdersConversionGraph: build.query<OrdersConversionGraph, void>({
      query: () => '/sales/v2/conversions-graph',
      transformResponse: (response: OrdersConversionGraph) => response,
    }),
    getOrdersMetrics: build.query<OrdersMetrics, void>({
      query: () => '/sales/v2/metrics',
      transformResponse: (response: OrdersMetrics) => response,
    }),
  }),
  overrideExisting: false,
});

export const { useGetOrdersConversionGraphQuery, useGetOrdersMetricsQuery } = ordersApi;
