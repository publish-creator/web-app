'use client';

import { Radio, RadioGroup } from '@heroui/react';

export type Choice = { id: string; label: string; hint: string };

interface RootOfferChoiceProps {
  label: string;
  options: readonly Choice[];
  value: string;
  onChange: (id: string) => void;
}

export const RootOfferChoice = ({ label, options, value, onChange }: RootOfferChoiceProps) => (
  <RadioGroup aria-label={label} onChange={onChange} value={value}>
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => (
        <Radio
          className="border-border data-[selected=true]:border-accent data-[selected=true]:bg-accent/5 flex items-start gap-3 rounded-xl border p-4"
          key={option.id}
          value={option.id}
        >
          <Radio.Control>
            <Radio.Indicator />
          </Radio.Control>
          <span className="flex flex-col gap-1">
            <span className="text-sm font-medium">{option.label}</span>
            <span className="text-muted text-xs leading-snug">{option.hint}</span>
          </span>
        </Radio>
      ))}
    </div>
  </RadioGroup>
);
