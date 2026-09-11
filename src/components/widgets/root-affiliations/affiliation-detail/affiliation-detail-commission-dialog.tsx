'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useEffect } from 'react';

import { Button, Modal, ToggleButton, ToggleButtonGroup } from '@heroui/react';

import { TextField } from '@/components/composites';
import { messageFromError } from '@/lib/api/error-message';
import type { AffiliationDetail } from '@/store/services/offers/offer-details.types';

const TYPES = [
  { id: 'CPA', label: 'CPA' },
  { id: 'REV_SHARE', label: 'Rev share' },
] as const;

const ROWS = [
  { key: 'front', label: 'Front', hint: 'Venda principal' },
  { key: 'back', label: 'Back', hint: 'Upsell' },
  { key: 'recurrence', label: 'Recorrência', hint: 'Cobranças seguintes' },
] as const;

const commissionType = z.enum(['CPA', 'REV_SHARE']);
const schema = z.object({
  frontCommissionType: commissionType,
  frontCommissionValue: z.number().min(0),
  backCommissionType: commissionType,
  backCommissionValue: z.number().min(0),
  recurrenceCommissionType: commissionType,
  recurrenceCommissionValue: z.number().min(0),
});

export type AffiliationCommissionValues = z.infer<typeof schema>;

const valuesFrom = (data: AffiliationDetail): AffiliationCommissionValues => ({
  frontCommissionType: data.frontCommissionType,
  frontCommissionValue: Number(data.frontCommissionValue),
  backCommissionType: data.backCommissionType,
  backCommissionValue: Number(data.backCommissionValue),
  recurrenceCommissionType: data.recurrenceCommissionType,
  recurrenceCommissionValue: Number(data.recurrenceCommissionValue),
});

const toggleClass =
  'h-9 min-w-20 justify-center rounded-lg bg-transparent text-muted data-[selected=true]:bg-surface-secondary data-[selected=true]:text-foreground';

interface Props {
  data: AffiliationDetail;
  error: unknown;
  isOpen: boolean;
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: AffiliationCommissionValues) => Promise<void>;
}

export const AffiliationDetailCommissionDialog = ({
  data,
  error,
  isOpen,
  isSaving,
  onOpenChange,
  onSave,
}: Props) => {
  const form = useForm<AffiliationCommissionValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) form.reset(valuesFrom(data));
  }, [data, form, isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-lg">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Editar comissões</Modal.Heading>
              <p className="text-muted text-sm">
                Vale só para este afiliado. Não altera o padrão da oferta.
              </p>
            </Modal.Header>
            <Modal.Body className="flex flex-col divide-y">
              {ROWS.map((row) => {
                const typeName = `${row.key}CommissionType` as const;
                const valueName = `${row.key}CommissionValue` as const;

                return (
                  <div
                    className="grid items-center gap-3 py-3 first:pt-0 last:pb-0 md:grid-cols-[7.5rem_1fr_8.5rem]"
                    key={row.key}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{row.label}</span>
                      <span className="text-muted text-xs">{row.hint}</span>
                    </div>
                    <Controller
                      control={form.control}
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
                      control={form.control}
                      name={valueName}
                      render={({ field, fieldState }) => (
                        <Controller
                          control={form.control}
                          name={typeName}
                          render={({ field: typeField }) => (
                            <TextField
                              errorMessage={fieldState.error?.message}
                              inputMode="decimal"
                              onChange={(value) => field.onChange(Number(value) || 0)}
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
            </Modal.Body>
            {error ? (
              <p className="text-danger px-6 pb-2 text-sm">{messageFromError(error)}</p>
            ) : null}
            <div className="flex justify-end gap-2 px-6 pb-5">
              <Button onPress={() => onOpenChange(false)} variant="secondary">
                Cancelar
              </Button>
              <Button
                isPending={isSaving}
                onPress={() => void form.handleSubmit((values) => onSave(schema.parse(values)))()}
              >
                Salvar
              </Button>
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
