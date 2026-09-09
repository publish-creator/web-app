'use client';

import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import { ToggleButton, ToggleButtonGroup } from '@heroui/react';

import { TextField } from '@/components/composites';

import type { OfferFormInput } from './root-offer.form';

const TYPES = [
  { id: 'CPA', label: 'CPA' },
  { id: 'REV_SHARE', label: 'Rev share' },
] as const;

const ROWS = [
  { key: 'front', label: 'Front', hint: 'A venda principal' },
  { key: 'back', label: 'Back', hint: 'O upsell depois da compra' },
  { key: 'recurrence', label: 'Recorrência', hint: 'Cada cobrança seguinte' },
] as const;

const toggleClass =
  'rounded-full bg-transparent text-muted data-[selected=true]:bg-surface-secondary data-[selected=true]:text-foreground';

export const RootOfferCommissionTab = ({ control }: { control: Control<OfferFormInput> }) => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-1">
      <h2 className="text-sm font-semibold">Comissão padrão da oferta</h2>
      <p className="text-muted text-sm">
        É o que um afiliado recebe ao entrar. Depois de afiliado, ajustar o valor dele não muda esta
        aqui.
      </p>
    </div>

    {ROWS.map((row) => {
      const typeName = `${row.key}CommissionType` as const;
      const valueName = `${row.key}CommissionValue` as const;

      return (
        <section className="flex flex-col gap-3" key={row.key}>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{row.label}</span>
            <span className="text-muted text-xs">{row.hint}</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Controller
              control={control}
              name={typeName}
              render={({ field }) => (
                <ToggleButtonGroup
                  aria-label={`Tipo da comissão ${row.label}`}
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
        </section>
      );
    })}

    <p className="text-muted text-xs">
      A soma não é validada: ninguém decidiu ainda sobre o que o percentual incide, e um teto
      chutado recusaria termo legítimo.
    </p>
  </div>
);
