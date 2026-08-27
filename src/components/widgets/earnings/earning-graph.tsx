'use client';

import type { OrdersConversionGraph } from '@/store/services/orders/orders.types';

import { Widget } from '@heroui-pro/react';
import { ComposedChart } from '@heroui-pro/react/composed-chart';

type EarningRevenueGraphProps = {
  data: OrdersConversionGraph | undefined;
};

function formatRevenueTick(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return `${value}`;
}

function formatDateTick(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-muted text-xs">{label}</span>
    </div>
  );
}

export function EarningRevenueGraph({ data }: EarningRevenueGraphProps) {
  return (
    <Widget>
      <Widget.Header>
        <Widget.Title>Revenue vs Conversions</Widget.Title>
        <div className="flex items-center gap-4">
          <LegendDot color="var(--chart-3)" label="Value Net" />
          <LegendDot color="var(--chart-1)" label="Conversions" />
        </div>
      </Widget.Header>
      <Widget.Content>
        <ComposedChart
          data={data?.graph ?? []}
          height={260}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenue-gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <ComposedChart.Grid vertical={false} />
          <ComposedChart.XAxis
            dataKey="date"
            minTickGap={32}
            tickFormatter={formatDateTick}
            tickMargin={8}
          />
          <ComposedChart.YAxis
            orientation="left"
            tickFormatter={formatRevenueTick}
            width={40}
            yAxisId="revenue"
          />
          <ComposedChart.YAxis
            orientation="right"
            tickFormatter={(value: number) => `${value}`}
            width={36}
            yAxisId="conversions"
          />
          <ComposedChart.Area
            dataKey="valueNet"
            dot={false}
            fill="url(#revenue-gradient)"
            name="Value Net"
            stroke="var(--chart-3)"
            strokeWidth={2}
            type="monotone"
            yAxisId="revenue"
          />
          <ComposedChart.Line
            dataKey="conversions"
            dot={false}
            name="Conversions"
            stroke="var(--chart-1)"
            strokeDasharray="6 3"
            strokeWidth={2}
            type="monotone"
            yAxisId="conversions"
          />
          <ComposedChart.Tooltip content={<ComposedChart.TooltipContent />} />
        </ComposedChart>
      </Widget.Content>
    </Widget>
  );
}
