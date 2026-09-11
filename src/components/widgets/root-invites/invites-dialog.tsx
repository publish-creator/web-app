'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { Button, Modal, Switch } from '@heroui/react';

import { TextField } from '@/components/composites';
import type { InviteCode, InviteCodeWriteBody } from '@/store/services/users/invite-codes.types';
import { RootOfferChoice } from '@/widgets/root-offer';

import {
  EMPTY_INVITE_FORM,
  formValuesFromInvite,
  inviteFormSchema,
  writeBodyFrom,
} from './invite.form';
import type { InviteFormValues } from './invite.form';

const KIND_OPTIONS = [
  { id: 'LINK', label: 'Link / código', hint: 'Qualquer pessoa com o código entra.' },
  { id: 'EMAIL', label: 'E-mail', hint: 'Só vale para o endereço informado.' },
] as const;

interface Props {
  editing: InviteCode | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitInvite: (body: InviteCodeWriteBody) => void | Promise<void>;
}

export const RootInvitesDialog = ({ editing, isOpen, onOpenChange, onSubmitInvite }: Props) => (
  <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    <Modal.Backdrop>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-lg">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>{editing ? 'Editar convite' : 'Novo convite'}</Modal.Heading>
            {editing ? (
              <p className="text-muted truncate font-mono text-xs">{editing.code}</p>
            ) : (
              <p className="text-muted text-xs">
                O código é gerado na criação. Depois você só ajusta validade e usos.
              </p>
            )}
          </Modal.Header>
          {isOpen ? (
            <DialogForm
              editing={editing}
              key={editing?.id ?? 'new'}
              onOpenChange={onOpenChange}
              onSubmitInvite={onSubmitInvite}
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
  onSubmitInvite,
}: {
  editing: InviteCode | null;
  onOpenChange: (open: boolean) => void;
  onSubmitInvite: (body: InviteCodeWriteBody) => void | Promise<void>;
}) => {
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: editing ? formValuesFromInvite(editing) : EMPTY_INVITE_FORM,
  });
  const kind = useWatch({ control: form.control, name: 'kind' });
  const reusable = useWatch({ control: form.control, name: 'reusable' });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit(async (values) => {
          await onSubmitInvite(writeBodyFrom(values));
          onOpenChange(false);
        })();
      }}
    >
      <Modal.Body className="flex flex-col gap-4">
        {editing ? (
          <TextField isDisabled label="Código" value={editing.code} variant="secondary" />
        ) : (
          <Controller
            control={form.control}
            name="kind"
            render={({ field }) => (
              <RootOfferChoice
                label="Tipo"
                onChange={field.onChange}
                options={KIND_OPTIONS}
                value={field.value}
              />
            )}
          />
        )}
        {kind === 'EMAIL' ? (
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <TextField
                errorMessage={fieldState.error?.message}
                label="E-mail"
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                placeholder="pessoa@empresa.com"
                ref={field.ref}
                value={field.value}
                variant="secondary"
              />
            )}
          />
        ) : null}
        <Controller
          control={form.control}
          name="name"
          render={({ field }) => (
            <TextField {...field} label="Nome interno" placeholder="Opcional" variant="secondary" />
          )}
        />
        <Controller
          control={form.control}
          name="reusable"
          render={({ field }) => (
            <div className="border-border flex items-center justify-between gap-4 rounded-xl border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Reutilizável</p>
                <p className="text-muted text-xs">Desative para um único cadastro.</p>
              </div>
              <Switch isSelected={field.value} onChange={field.onChange}>
                <Switch.Content>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Content>
              </Switch>
            </div>
          )}
        />
        {reusable ? (
          <Controller
            control={form.control}
            name="maxUses"
            render={({ field, fieldState }) => (
              <TextField
                errorMessage={fieldState.error?.message}
                label="Máximo de usos (vazio = ilimitado)"
                onChange={(value) => field.onChange(value === '' ? null : Number(value))}
                type="number"
                value={field.value === null ? '' : String(field.value)}
                variant="secondary"
              />
            )}
          />
        ) : null}
        <Controller
          control={form.control}
          name="expiresAt"
          render={({ field, fieldState }) => (
            <TextField
              errorMessage={fieldState.error?.message}
              label="Válido até"
              onChange={field.onChange}
              type="datetime-local"
              value={toLocalInput(field.value)}
              variant="secondary"
            />
          )}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onPress={() => onOpenChange(false)} variant="secondary">
          Cancelar
        </Button>
        <Button isPending={form.formState.isSubmitting} type="submit">
          {editing ? 'Salvar' : 'Criar'}
        </Button>
      </Modal.Footer>
    </form>
  );
};

const toLocalInput = (iso: string) => {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return '';

  const pad = (value: number) => String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
