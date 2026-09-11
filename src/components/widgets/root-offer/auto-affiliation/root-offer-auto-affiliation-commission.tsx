'use client';

import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import { ToggleButton, ToggleButtonGroup } from '@heroui/react';

import { TextField } from '@/components/composites';

import type { AutoAffiliationFormValues } from './root-offer-auto-affiliation.form';

const TYPES = [
  { id: 'CPA', label: 'CPA' },
  { id: 'REV_SHARE', label: 'Rev share' },
] as const;

const toggleClass =
  'flex-1 justify-center rounded-xl bg-transparent text-muted data-[selected=true]:bg-surface-secondary data-[selected=true]:text-foreground';

type CommissionTypeName = 'frontCommissionType' | 'backCommissionType' | 'recurrenceCommissionType';

type CommissionValueName =
  | 'frontCommissionValue'
  | 'backCommissionValue'
  | 'recurrenceCommissionValue';

export const RootOfferAutoAffiliationCommissionRow = ({
  control,
  label,
  hint,
  typeName,
  valueName,
}: {
  control: Control<AutoAffiliationFormValues>;
  label: string;
  hint: string;
  typeName: CommissionTypeName;
  valueName: CommissionValueName;
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-muted text-xs">{hint}</span>
    </div>
    <div className="grid gap-2 sm:grid-cols-[1fr_7.5rem]">
      <Controller
        control={control}
        name={typeName}
        render={({ field }) => (
          <ToggleButtonGroup
            aria-label={`Tipo da comissão ${label}`}
            className="flex gap-1"
            onSelectionChange={(keys) => {
              const [first] = [...keys];

              if (typeof first === 'string') field.onChange(first);
            }}
            selectedKeys={new Set([field.value])}
            selectionMode="single"
          >
            {TYPES.map((type) => (
              <ToggleButton className={toggleClass} id={type.id} key={type.id}>
                {type.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      />
      <Controller
        control={control}
        name={valueName}
        render={({ field, fieldState }) => (
          <Controller
            control={control}
            name={typeName}
            render={({ field: typeField }) => (
              <TextField
                errorMessage={fieldState.error?.message}
                inputMode="decimal"
                onChange={(value) => field.onChange(Number(value) || 0)}
                startContent={
                  <span className="text-muted text-sm">
                    {typeField.value === 'REV_SHARE' ? '%' : '$'}
                  </span>
                }
                value={String(field.value ?? '')}
                variant="secondary"
              />
            )}
          />
        )}
      />
    </div>
  </div>
);
