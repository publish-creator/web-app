'use client';

import type { OrdersMetrics } from '@/store/services/orders/orders.types';
import { formatCurrency } from '@/utils/format-currency';
import { TrendChip, Widget } from '@heroui-pro/react';

interface EarningKPIConversionProps {
  data: OrdersMetrics;
}

export function EarningKPIConversion({ data }: EarningKPIConversionProps) {
  return (
    <Widget className="md:col-span-2">
      <Widget.Header>
        <Widget.Title>Overview</Widget.Title>
      </Widget.Header>
      <Widget.Content className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            change: '12.5%',
            title: 'Revenue',
            trend: 'up' as const,
            value: formatCurrency(data?.totalGross ?? 0, 'USD'),
          },
          { change: '8.2%', title: 'Orders', trend: 'up' as const, value: data?.totalSales ?? 0 },
          {
            change: '3.1%',
            title: 'AOV',
            trend: 'up' as const,
            value: formatCurrency(data?.aov ?? 0, 'USD'),
          },
          {
            change: '0.4%',
            title: 'Conversion',
            trend: 'down' as const,
            value: data?.profitPercentage ?? 0,
          },
        ].map((item) => (
          <div className="flex flex-col gap-1" key={item.title}>
            <span className="text-muted text-xs">{item.title}</span>
            <div className="flex items-center gap-2">
              <span className="text-foreground text-xl font-semibold">{item.value}</span>
              <TrendChip trend={item.trend} variant="soft">
                {item.change}
              </TrendChip>
            </div>
          </div>
        ))}
      </Widget.Content>
    </Widget>
  );
}
