'use client';

import { QuerySearchField } from '@/components/composites/search-field';
import {
  EarningDataGrid,
  EarningKPIConversion,
  EarningsKPIBalance,
} from '@/components/widgets/earnings';
import { EarningRevenueGraph } from '@/components/widgets/earnings/earning-graph';
import { useGetFinancesBalanceQuery } from '@/store/services/finances/finances.api';
import {
  useGetOrdersConversionGraphQuery,
  useGetOrdersMetricsQuery,
} from '@/store/services/orders/orders.api';
import { Button } from '@heroui/react';
import { ExportIcon, FilterIcon } from '@solar-icons/react/bold';

export function EarningsPage() {
  const { data: financesBalance } = useGetFinancesBalanceQuery();
  const { data: ordersConversionGraph } = useGetOrdersConversionGraphQuery();
  const { data: ordersMetrics } = useGetOrdersMetricsQuery();
  return (
    <div className="flex flex-col gap-4">
      <EarningsKPIBalance data={financesBalance} />
      <div className="flex items-center gap-2">
        <QuerySearchField
          onClear={() => {}}
          onInputChange={() => {}}
          placeholder="Search earnings"
        />
        <Button arial-label="Filter" className="text-muted" variant="tertiary">
          <FilterIcon />
          Filter
        </Button>
        <Button arial-label="Export" className="ml-auto" variant="secondary">
          <ExportIcon />
          Export
        </Button>
      </div>
      <EarningRevenueGraph data={ordersConversionGraph} />
      <EarningKPIConversion data={ordersMetrics} />
      <EarningDataGrid />
    </div>
  );
}
