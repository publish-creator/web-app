'use client';

import { Person } from '@gravity-ui/icons';
import { Controller, useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import { ListBox, Select, Switch } from '@heroui/react';

import type { OfferFormInput } from '../root-offer.form';
import { RootOfferPanel } from './root-offer-panel';
import { RootOfferTagsField } from './root-offer-tags-field';
import { RootOfferUsersField } from './root-offer-users-field';

const PERMISSION = [
  { id: 'manual', label: 'Revisar antes' },
  { id: 'automatic', label: 'Aprovar na hora' },
] as const;

export const RootOfferAccessPanel = ({ control }: { control: Control<OfferFormInput> }) => {
  const isOpen = useWatch({ control, name: 'isAvailableForAllUsers' }) ?? false;

  return (
    <RootOfferPanel
      title={
        <span className="flex items-center gap-2">
          <Person className="text-accent size-4" />
          Afiliação
        </span>
      }
    >
      <Controller
        control={control}
        name="allowsAutomaticAffiliation"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Permissão de afiliação</span>
            <Select
              aria-label="Permissão de afiliação"
              onChange={(next) => {
                if (next == null) return;
                field.onChange(String(next) === 'automatic');
              }}
              value={field.value ? 'automatic' : 'manual'}
              variant="secondary"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {PERMISSION.map((option) => (
                    <ListBox.Item id={option.id} key={option.id} textValue={option.label}>
                      {option.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        )}
      />

      <Controller
        control={control}
        name="isAvailableForAllUsers"
        render={({ field }) => (
          <div className="border-border flex items-center justify-between gap-4 rounded-xl border px-4 py-3">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-medium">Disponível para todos</span>
              <p className="text-muted text-xs leading-snug">
                Ative para liberar a oferta a todos os usuários. Desative para restringir por
                usuários ou tags.
              </p>
            </div>
            <Switch
              aria-label="Disponível para todos"
              isSelected={field.value}
              onChange={field.onChange}
            >
              <Switch.Content>
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch.Content>
            </Switch>
          </div>
        )}
      />

      {isOpen ? null : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-muted text-[11px] font-semibold tracking-wide uppercase">
              Usuários permitidos
            </span>
            <Controller
              control={control}
              name="allowedUserIds"
              render={({ field }) => (
                <RootOfferUsersField onChange={field.onChange} value={field.value ?? []} />
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-muted text-[11px] font-semibold tracking-wide uppercase">
              Tags permitidas
            </span>
            <RootOfferTagsField control={control} />
          </div>
        </div>
      )}
    </RootOfferPanel>
  );
};
