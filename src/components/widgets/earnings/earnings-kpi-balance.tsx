'use client';

import type { FinancesBalance } from '@/store/services/finances/finanes.type';
import { formatCurrency } from '@/utils/format-currency';
import { Widget } from '@heroui-pro/react';

interface EarningsKPIBalanceProps {
  data: FinancesBalance | undefined;
}

export function EarningsKPIBalance({ data }: EarningsKPIBalanceProps) {
  return (
    // <KPIGroup>
    //   <KPI>
    //     <KPI.Header>
    //       <KPI.Title>Available Balance</KPI.Title>
    //     </KPI.Header>
    //     <KPI.Content>
    //       <KPI.Value currency="USD" maximumFractionDigits={0} prefix="$" value={100000} />
    //       {/* <KPI.Trend trend="up">+10%</KPI.Trend> */}
    //     </KPI.Content>
    //   </KPI>
    //   <KPIGroup.Separator />
    //   <KPI>
    //     <KPI.Header>
    //       <KPI.Title>Pending</KPI.Title>
    //     </KPI.Header>
    //     <KPI.Content>
    //       <KPI.Value maximumFractionDigits={0} value={1000} />
    //       <KPI.Trend trend="up">+10%</KPI.Trend>
    //     </KPI.Content>
    //   </KPI>
    //   <KPIGroup.Separator />
    //   <KPI>
    //     <KPI.Header>
    //       <KPI.Title>Retention </KPI.Title>
    //     </KPI.Header>
    //     <KPI.Content>
    //       <KPI.Value maximumFractionDigits={0} value={100} />
    //       <KPI.Trend trend="up">+10%</KPI.Trend>
    //     </KPI.Content>
    //   </KPI>
    // </KPIGroup>
    <Widget className="md:col-span-2">
      <Widget.Header>
        <Widget.Title>Overview</Widget.Title>
      </Widget.Header>
      <Widget.Content className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[
          {
            change: '12.5%',
            title: 'Available Balance',
            trend: 'up' as const,
            value: data?.balance?.available ?? 0,
            currency: 'USD',
          },
          {
            change: '8.2%',
            title: 'Pending',
            trend: 'up' as const,
            value: data?.balance?.pending?.release ?? 0,
            currency: 'USD',
          },
          {
            change: '3.1%',
            title: 'Retention',
            trend: 'up' as const,
            value: data?.balance?.pending?.retention ?? 0,
            currency: 'USD',
          },
        ].map((item) => (
          <div className="flex flex-col gap-1" key={item.title}>
            <span className="text-muted text-xs">{item.title}</span>
            <span className="text-foreground text-xl font-semibold">
              {formatCurrency(item.value, item.currency)}
            </span>
          </div>
        ))}
      </Widget.Content>
    </Widget>
  );
}
