'use client';

import { Description, Radio, RadioGroup } from '@heroui/react';

const OPTIONS = [
  { id: 'DRAFT', label: 'Rascunho', hint: 'Só quem administra vê. Salva sem link de vendas.' },
  {
    id: 'PUBLISHED',
    label: 'Publicada',
    hint: 'Afiliados que alcançam a oferta veem e podem pedir afiliação. Exige a página de vendas.',
  },
  {
    id: 'INACTIVE',
    label: 'Inativa',
    hint: 'Sai da listagem de todo mundo. Quem já se afiliou continua.',
  },
] as const;

interface RootOfferStatusFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const RootOfferStatusField = ({ value, onChange }: RootOfferStatusFieldProps) => (
  <RadioGroup aria-label="Status da oferta" onChange={onChange} value={value}>
    <div className="flex flex-col gap-2">
      {OPTIONS.map((option) => (
        <Radio
          className="border-border data-[selected=true]:border-accent flex items-start gap-3 rounded-xl border p-3"
          key={option.id}
          value={option.id}
        >
          <Radio.Control>
            <Radio.Indicator />
          </Radio.Control>
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{option.label}</span>
            <Description className="text-xs">{option.hint}</Description>
          </span>
        </Radio>
      ))}
    </div>
  </RadioGroup>
);
