'use client';

import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import { ToggleButton, ToggleButtonGroup } from '@heroui/react';

import { TextField } from '@/components/composites';

import { RootOfferPanel } from './fields';
import type { OfferFormInput } from './root-offer.form';

const TYPES = [
  { id: 'CPA', label: 'CPA' },
  { id: 'REV_SHARE', label: 'Rev share' },
] as const;

const ROWS = [
  { key: 'front', label: 'Front', hint: 'Venda principal' },
  { key: 'back', label: 'Back', hint: 'Upsell' },
  { key: 'recurrence', label: 'Recorrência', hint: 'Cobranças seguintes' },
] as const;

const toggleClass =
  'h-9 min-w-20 justify-center rounded-lg bg-transparent text-muted data-[selected=true]:bg-surface-secondary data-[selected=true]:text-foreground';

export const RootOfferCommissionTab = ({ control }: { control: Control<OfferFormInput> }) => (
  <RootOfferPanel
    description="Vale para quem entra agora. Afiliado já aprovado não muda."
    title="Comissão padrão"
  >
    <div className="border-border flex flex-col divide-y">
      {ROWS.map((row) => {
        const typeName = `${row.key}CommissionType` as const;
        const valueName = `${row.key}CommissionValue` as const;

        return (
          <div
            className="grid items-center gap-3 py-3 first:pt-0 last:pb-0 md:grid-cols-[8.5rem_1fr_9rem]"
            key={row.key}
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">{row.label}</span>
              <span className="text-muted text-xs">{row.hint}</span>
            </div>

            <Controller
              control={control}
              name={typeName}
              render={({ field }) => (
                <ToggleButtonGroup
                  aria-label={`Tipo da comissão ${row.label}`}
                  className="flex w-fit gap-1"
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
                      onChange={field.onChange}
                      startContent={
                        <span className="text-muted text-sm">
                          {typeField.value === 'REV_SHARE' ? '%' : 'R$'}
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
        );
      })}
    </div>
  </RootOfferPanel>
);
