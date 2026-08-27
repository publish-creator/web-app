import { api } from '../api/base-api';
import type { FinancesBalance } from './finanes.type';

export const financesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFinancesBalance: builder.query<FinancesBalance, void>({
      query: () => '/finances/balance',
    }),
  }),
  overrideExisting: false,
});

export const { useGetFinancesBalanceQuery } = financesApi;
