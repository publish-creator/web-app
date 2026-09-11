import { stableQueryKey } from '@/hooks/query/shared/stable-query-key';

import { api } from '../api/base-api';
import type {
  AdminAffiliationsResponse,
  AffiliationDetail,
  AutomaticAffiliationWriteBody,
  AutomaticAffiliationsResponse,
  BuyLinkWriteBody,
  BuyLinksResponse,
  OfferAffiliationsResponse,
  OfferAuditEntry,
  OfferAuditListResponse,
  OfferCreativesResponse,
  OfferSubListParams,
} from './offer-details.types';
import type { Offer, OfferUpdateArgs, OffersListParams, OffersListResponse } from './offers.types';

export const offersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOffers: builder.query<OffersListResponse, OffersListParams | void>({
      query: (params) => ({
        url: '/offers',
        params: params ?? {},
      }),
      serializeQueryArgs: ({ queryArgs }) =>
        stableQueryKey((queryArgs ?? {}) as Record<string, unknown>),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Offers' as const, id })),
              { type: 'Offers', id: 'LIST' },
            ]
          : [{ type: 'Offers', id: 'LIST' }],
    }),

    getOffer: builder.query<Offer, string>({
      query: (id) => ({ url: `/offers/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'Offers', id }],
    }),

    updateOffer: builder.mutation<{ id: string }, OfferUpdateArgs>({
      query: ({ id, body }) => ({ url: `/offers/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Offers', id },
        { type: 'Offers', id: 'LIST' },
      ],
    }),

    getOfferBuyLinks: builder.query<BuyLinksResponse, string>({
      query: (offerId) => ({ url: `/offers/${offerId}/buy-links` }),
      providesTags: (_result, _error, offerId) => [{ type: 'Offers', id: `${offerId}:buy-links` }],
    }),

    createOfferBuyLink: builder.mutation<
      { id: string; code: string; title: string },
      { offerId: string; body: BuyLinkWriteBody }
    >({
      query: ({ offerId, body }) => ({
        url: `/offers/${offerId}/buy-links`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { offerId }) => [
        { type: 'Offers', id: `${offerId}:buy-links` },
      ],
    }),

    updateOfferBuyLink: builder.mutation<
      { id: string; updated: boolean },
      { offerId: string; id: string; body: BuyLinkWriteBody }
    >({
      query: ({ offerId, id, body }) => ({
        url: `/offers/${offerId}/buy-links/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { offerId }) => [
        { type: 'Offers', id: `${offerId}:buy-links` },
      ],
    }),

    deleteOfferBuyLink: builder.mutation<
      { id: string; deleted: boolean },
      { offerId: string; id: string }
    >({
      query: ({ offerId, id }) => ({
        url: `/offers/${offerId}/buy-links/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { offerId }) => [
        { type: 'Offers', id: `${offerId}:buy-links` },
      ],
    }),

    getOfferCreatives: builder.query<
      OfferCreativesResponse,
      { offerId: string } & OfferSubListParams
    >({
      query: ({ offerId, ...params }) => ({ url: `/offers/${offerId}/creatives`, params }),
      serializeQueryArgs: ({ queryArgs }) => stableQueryKey(queryArgs as Record<string, unknown>),
      providesTags: (_result, _error, { offerId }) => [
        { type: 'Offers', id: `${offerId}:creatives` },
      ],
    }),

    getAutomaticAffiliations: builder.query<
      AutomaticAffiliationsResponse,
      { offerId: string; applyTo?: string } & OfferSubListParams
    >({
      query: ({ offerId, ...params }) => ({
        url: `/offers/${offerId}/automatic-affiliations`,
        params,
      }),
      serializeQueryArgs: ({ queryArgs }) => stableQueryKey(queryArgs as Record<string, unknown>),
      providesTags: (_result, _error, { offerId }) => [
        { type: 'Offers', id: `${offerId}:automatic-affiliations` },
      ],
    }),

    createAutomaticAffiliation: builder.mutation<
      { id: string },
      { offerId: string; body: AutomaticAffiliationWriteBody }
    >({
      query: ({ offerId, body }) => ({
        url: `/offers/${offerId}/automatic-affiliations`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { offerId }) => [
        { type: 'Offers', id: `${offerId}:automatic-affiliations` },
      ],
    }),

    updateAutomaticAffiliation: builder.mutation<
      { id: string },
      { offerId: string; id: string; body: AutomaticAffiliationWriteBody }
    >({
      query: ({ offerId, id, body }) => ({
        url: `/offers/${offerId}/automatic-affiliations/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { offerId }) => [
        { type: 'Offers', id: `${offerId}:automatic-affiliations` },
      ],
    }),

    deleteAutomaticAffiliation: builder.mutation<{ id: string }, { offerId: string; id: string }>({
      query: ({ offerId, id }) => ({
        url: `/offers/${offerId}/automatic-affiliations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { offerId }) => [
        { type: 'Offers', id: `${offerId}:automatic-affiliations` },
      ],
    }),

    getOfferAffiliations: builder.query<
      OfferAffiliationsResponse,
      { offerId: string; status?: string } & OfferSubListParams
    >({
      query: ({ offerId, ...params }) => ({
        url: `/offers/${offerId}/affiliations`,
        params,
      }),
      serializeQueryArgs: ({ queryArgs }) => stableQueryKey(queryArgs as Record<string, unknown>),
      providesTags: (_result, _error, { offerId }) => [
        { type: 'Offers', id: `${offerId}:affiliations` },
      ],
    }),

    assignOfferAffiliation: builder.mutation<
      { id: string; code: string; status: string },
      { offerId: string; userId: string }
    >({
      query: ({ offerId, userId }) => ({
        url: `/offers/${offerId}/affiliations/assign`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: (_result, _error, { offerId }) => [
        { type: 'Offers', id: `${offerId}:affiliations` },
        { type: 'Affiliations', id: 'LIST' },
      ],
    }),

    setAffiliationStatus: builder.mutation<
      { id: string; status: string },
      { offerId: string; id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/affiliations/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { offerId, id }) => [
        { type: 'Offers', id: `${offerId}:affiliations` },
        { type: 'Affiliations', id: 'LIST' },
        { type: 'Affiliations', id: 'MINE' },
        { type: 'Affiliations', id },
      ],
    }),

    getAdminAffiliation: builder.query<AffiliationDetail, string>({
      query: (id) => ({ url: `/affiliations/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'Affiliations', id }],
    }),

    setAffiliationCommission: builder.mutation<
      { id: string; commissionSource: string },
      {
        id: string;
        offerId: string;
        body: {
          frontCommissionType: 'CPA' | 'REV_SHARE';
          frontCommissionValue: number;
          backCommissionType: 'CPA' | 'REV_SHARE';
          backCommissionValue: number;
          recurrenceCommissionType: 'CPA' | 'REV_SHARE';
          recurrenceCommissionValue: number;
        };
      }
    >({
      query: ({ id, body }) => ({
        url: `/affiliations/${id}/commission`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id, offerId }) => [
        { type: 'Affiliations', id },
        { type: 'Affiliations', id: 'LIST' },
        { type: 'Offers', id: `${offerId}:affiliations` },
      ],
    }),

    getMyAffiliations: builder.query<
      OfferAffiliationsResponse,
      { status?: string; offerId?: string } & OfferSubListParams
    >({
      query: (params) => ({ url: '/affiliations', params }),
      serializeQueryArgs: ({ queryArgs }) => stableQueryKey(queryArgs as Record<string, unknown>),
      providesTags: [{ type: 'Affiliations', id: 'MINE' }],
    }),

    requestOfferAffiliation: builder.mutation<
      { id: string; code: string; status: string },
      { offerId: string }
    >({
      query: ({ offerId }) => ({
        url: `/offers/${offerId}/affiliations`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { offerId }) => [
        { type: 'Offers', id: offerId },
        { type: 'Offers', id: 'LIST' },
        { type: 'Affiliations', id: 'LIST' },
        { type: 'Affiliations', id: 'MINE' },
      ],
    }),

    getOfferAudit: builder.query<OfferAuditListResponse, { offerId: string } & OfferSubListParams>({
      query: ({ offerId, ...params }) => ({ url: `/offers/${offerId}/audit`, params }),
      serializeQueryArgs: ({ queryArgs }) => stableQueryKey(queryArgs as Record<string, unknown>),
      providesTags: (_result, _error, { offerId }) => [{ type: 'Offers', id: `${offerId}:audit` }],
    }),

    getOfferAuditEntry: builder.query<OfferAuditEntry, { offerId: string; entryId: string }>({
      query: ({ offerId, entryId }) => ({ url: `/offers/${offerId}/audit/${entryId}` }),
      providesTags: (_result, _error, { offerId, entryId }) => [
        { type: 'Offers', id: `${offerId}:audit:${entryId}` },
      ],
    }),

    getAdminAffiliations: builder.query<
      AdminAffiliationsResponse,
      {
        status?: string;
        filter?: string;
        userTagIds?: string;
        offerIds?: string;
      } & OfferSubListParams
    >({
      query: (params) => ({ url: '/affiliations/admin', params }),
      serializeQueryArgs: ({ queryArgs }) => stableQueryKey(queryArgs as Record<string, unknown>),
      providesTags: [{ type: 'Affiliations', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOffersQuery,
  useGetOfferQuery,
  useUpdateOfferMutation,
  useGetOfferBuyLinksQuery,
  useCreateOfferBuyLinkMutation,
  useUpdateOfferBuyLinkMutation,
  useDeleteOfferBuyLinkMutation,
  useGetOfferCreativesQuery,
  useGetAutomaticAffiliationsQuery,
  useCreateAutomaticAffiliationMutation,
  useUpdateAutomaticAffiliationMutation,
  useDeleteAutomaticAffiliationMutation,
  useGetOfferAffiliationsQuery,
  useGetOfferAuditQuery,
  useGetOfferAuditEntryQuery,
  useGetAdminAffiliationsQuery,
  useGetAdminAffiliationQuery,
  useGetMyAffiliationsQuery,
  useRequestOfferAffiliationMutation,
  useAssignOfferAffiliationMutation,
  useSetAffiliationStatusMutation,
  useSetAffiliationCommissionMutation,
} = offersApi;
