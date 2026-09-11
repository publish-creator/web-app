'use client';

import { Radio, RadioGroup } from '@heroui/react';

export type Choice = { id: string; label: string; hint: string };

interface RootOfferChoiceProps {
  label: string;
  options: readonly Choice[];
  value: string;
  onChange: (id: string) => void;
  columns?: 2 | 3;
}

export const RootOfferChoice = ({
  label,
  options,
  value,
  onChange,
  columns = 2,
}: RootOfferChoiceProps) => (
  <RadioGroup aria-label={label} onChange={onChange} value={value}>
    <div className={columns === 3 ? 'grid gap-2 sm:grid-cols-3' : 'grid gap-2 sm:grid-cols-2'}>
      {options.map((option) => (
        <Radio
          className="border-border data-[selected=true]:border-accent data-[selected=true]:bg-accent/5 flex items-start gap-2.5 rounded-xl border px-3 py-2.5"
          key={option.id}
          value={option.id}
        >
          <Radio.Control>
            <Radio.Indicator />
          </Radio.Control>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-sm font-medium">{option.label}</span>
            <span className="text-muted text-xs leading-snug">{option.hint}</span>
          </span>
        </Radio>
      ))}
    </div>
  </RadioGroup>
);
