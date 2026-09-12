'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { useState } from 'react';

import { Avatar, Button, Checkbox, Modal, SearchField, Spinner } from '@heroui/react';

import type { Coproducer, CoproducerWriteBody } from '@/store/services/offers/offer-details.types';
import { useSearchUsersQuery } from '@/store/services/users';
import type { UserRow } from '@/store/services/users';

import { RootOfferAutoAffiliationCommissionRow } from '../auto-affiliation/root-offer-auto-affiliation-commission';
import { RootOfferChoice } from '../fields';
import {
  COPRODUCER_STATUS,
  EMPTY_COPRODUCER_FORM,
  STATUS_LABEL,
  coproducerFormSchema,
  createBodyFrom,
  formValuesFrom,
} from './root-offer-coproducers.form';
import type { CoproducerFormValues } from './root-offer-coproducers.form';

interface RootOfferCoproducersDialogProps {
  offerTitle: string;
  editing: Coproducer | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitRule: (body: CoproducerWriteBody) => void | Promise<void>;
}

const initials = (value: string) => value.trim().charAt(0).toUpperCase() || '?';

export const RootOfferCoproducersDialog = ({
  offerTitle,
  editing,
  isOpen,
  onOpenChange,
  onSubmitRule,
}: RootOfferCoproducersDialogProps) => (
  <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    <Modal.Backdrop>
      <Modal.Container>
        <Modal.Dialog className="max-h-[90vh] sm:max-w-2xl">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>{editing ? 'Editar coprodutor' : 'Novo coprodutor'}</Modal.Heading>
            <p className="text-muted text-sm">{offerTitle}</p>
          </Modal.Header>
          {isOpen ? (
            <DialogForm
              editing={editing}
              key={editing?.id ?? 'new'}
              onOpenChange={onOpenChange}
              onSubmitRule={onSubmitRule}
            />
          ) : null}
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  </Modal>
);

const DialogForm = ({
  editing,
  onOpenChange,
  onSubmitRule,
}: {
  editing: Coproducer | null;
  onOpenChange: (open: boolean) => void;
  onSubmitRule: (body: CoproducerWriteBody) => void | Promise<void>;
}) => {
  const [term, setTerm] = useState('');
  const form = useForm<CoproducerFormValues>({
    resolver: zodResolver(coproducerFormSchema),
    defaultValues: editing ? formValuesFrom(editing) : EMPTY_COPRODUCER_FORM,
  });

  const userId = useWatch({ control: form.control, name: 'userId' });
  const userName = useWatch({ control: form.control, name: 'userName' }) ?? '';
  const sameAsFront = useWatch({ control: form.control, name: 'sameAsFront' }) ?? false;

  const { data: found, isFetching } = useSearchUsersQuery(
    { page: 1, pageSize: 20, filter: term },
    { skip: Boolean(editing) || term.length < 2 },
  );

  const results = (found?.data ?? []).filter((row) => row.status === 'ACTIVE');

  const pick = (row: UserRow) => {
    form.setValue('userId', row.id, { shouldValidate: true });
    form.setValue('userName', row.name);
    form.setValue('userEmail', row.email);
    setTerm('');
  };

  return (
    <>
      <Modal.Body className="flex flex-col gap-5 overflow-y-auto">
        <section className="flex flex-col gap-2">
          <span className="text-sm font-medium">Pessoa</span>
          <p className="text-muted text-xs">
            Se ela já for afiliada desta oferta, o pedido vivo vira recusado.
          </p>

          {editing || userId ? (
            <div className="border-border flex items-center gap-3 rounded-xl border px-3 py-2">
              <Avatar className="size-8 shrink-0">
                <Avatar.Fallback>{initials(userName)}</Avatar.Fallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{userName || 'Pessoa'}</p>
                <p className="text-muted truncate text-xs">{form.getValues('userEmail')}</p>
              </div>
            </div>
          ) : (
            <>
              <SearchField
                aria-label="Buscar pessoa"
                onChange={setTerm}
                value={term}
                variant="secondary"
              >
                <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input placeholder="Nome ou e-mail" />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>
              {isFetching ? <Spinner size="sm" /> : null}
              {results.map((row) => (
                <button
                  className="hover:bg-surface-secondary flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left"
                  key={row.id}
                  onClick={() => pick(row)}
                  type="button"
                >
                  <Avatar className="size-8 shrink-0">
                    <Avatar.Fallback>{initials(row.name)}</Avatar.Fallback>
                  </Avatar>
                  <span className="min-w-0">
                    <span className="block truncate text-sm">{row.name}</span>
                    <span className="text-muted block truncate text-xs">{row.email}</span>
                  </span>
                </button>
              ))}
            </>
          )}
          {form.formState.errors.userId ? (
            <p className="text-danger text-xs">Escolha uma pessoa ativa.</p>
          ) : null}
        </section>

        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <RootOfferChoice
              columns={3}
              label="Estado"
              onChange={field.onChange}
              options={COPRODUCER_STATUS.map((id) => ({
                id,
                label: STATUS_LABEL[id],
                hint:
                  id === 'ACTIVE'
                    ? 'Recebe nas vendas'
                    : id === 'PAUSED'
                      ? 'Cadastrado, sem receber'
                      : 'Ainda não aceitou',
              }))}
              value={field.value}
            />
          )}
        />

        <section className="flex flex-col gap-3">
          <span className="text-sm font-medium">Comissão</span>
          <RootOfferAutoAffiliationCommissionRow
            control={form.control}
            hint="Venda principal"
            label="Front"
            typeName="frontCommissionType"
            valueName="frontCommissionValue"
          />
          <Controller
            control={form.control}
            name="sameAsFront"
            render={({ field }) => (
              <Checkbox isSelected={field.value} onChange={field.onChange}>
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content className="text-sm">
                  Back e recorrência iguais ao front
                </Checkbox.Content>
              </Checkbox>
            )}
          />
          {sameAsFront ? null : (
            <>
              <RootOfferAutoAffiliationCommissionRow
                control={form.control}
                hint="Upsell"
                label="Back"
                typeName="backCommissionType"
                valueName="backCommissionValue"
              />
              <RootOfferAutoAffiliationCommissionRow
                control={form.control}
                hint="Cobranças seguintes"
                label="Assinatura"
                typeName="recurrenceCommissionType"
                valueName="recurrenceCommissionValue"
              />
            </>
          )}
        </section>

        <Controller
          control={form.control}
          name="payRefund"
          render={({ field }) => (
            <Checkbox isSelected={field.value} onChange={field.onChange}>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content className="text-sm">Participa de estorno</Checkbox.Content>
            </Checkbox>
          )}
        />
        <Controller
          control={form.control}
          name="payTransactionalTax"
          render={({ field }) => (
            <Checkbox isSelected={field.value} onChange={field.onChange}>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content className="text-sm">
                REV_SHARE desconta taxa transacional
              </Checkbox.Content>
            </Checkbox>
          )}
        />
      </Modal.Body>
      <div className="flex justify-end gap-2 px-6 pb-5">
        <Button onPress={() => onOpenChange(false)} variant="secondary">
          Cancelar
        </Button>
        <Button
          onPress={() => {
            void form.handleSubmit(async (values) => {
              const body = createBodyFrom(values);

              if (editing) delete body.userId;
              await onSubmitRule(body);
              onOpenChange(false);
            })();
          }}
        >
          {editing ? 'Salvar' : 'Adicionar'}
        </Button>
      </div>
    </>
  );
};
