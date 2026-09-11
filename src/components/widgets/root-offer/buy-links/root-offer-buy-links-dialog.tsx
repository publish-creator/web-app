'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';

import { Button, Modal, Switch } from '@heroui/react';

import { TextField } from '@/components/composites';
import type { BuyLink, BuyLinkWriteBody } from '@/store/services/offers/offer-details.types';

import { RootOfferCoverField, RootOfferUsersField } from '../fields';
import {
  EMPTY_BUY_LINK_FORM,
  buyLinkFormSchema,
  formValuesFromLink,
  writeBodyFrom,
} from './root-offer-buy-links.form';
import type { BuyLinkFormValues } from './root-offer-buy-links.form';

interface RootOfferBuyLinksDialogProps {
  offerTitle: string;
  offerCode: string;
  editing: BuyLink | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitLink: (body: BuyLinkWriteBody) => void | Promise<void>;
}

export const RootOfferBuyLinksDialog = ({
  offerTitle,
  offerCode,
  editing,
  isOpen,
  onOpenChange,
  onSubmitLink,
}: RootOfferBuyLinksDialogProps) => (
  <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    <Modal.Backdrop>
      <Modal.Container>
        <Modal.Dialog className="max-h-[90vh] sm:max-w-2xl">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>{editing ? 'Editar buy link' : 'Novo buy link'}</Modal.Heading>
            <p className="text-muted text-sm">
              {offerTitle} · {offerCode}
            </p>
          </Modal.Header>
          {isOpen ? (
            <DialogForm
              editing={editing}
              key={editing?.id ?? 'new'}
              onOpenChange={onOpenChange}
              onSubmitLink={onSubmitLink}
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
  onSubmitLink,
}: {
  editing: BuyLink | null;
  onOpenChange: (open: boolean) => void;
  onSubmitLink: (body: BuyLinkWriteBody) => void | Promise<void>;
}) => {
  const form = useForm<BuyLinkFormValues>({
    resolver: zodResolver(buyLinkFormSchema) as Resolver<BuyLinkFormValues>,
    defaultValues: editing ? formValuesFromLink(editing) : EMPTY_BUY_LINK_FORM,
  });
  const isOpenToAll = useWatch({ control: form.control, name: 'isAvailableForAllUsers' });
  const imagePreview = useWatch({ control: form.control, name: 'imageUrl' });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit(async (values) => {
          await onSubmitLink(writeBodyFrom(values));
          onOpenChange(false);
        })();
      }}
    >
      <Modal.Body className="flex flex-col gap-4 overflow-y-auto">
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              errorMessage={fieldState.error?.message}
              label="Título"
              placeholder="Checkout principal"
              variant="secondary"
            />
          )}
        />

        <Controller
          control={form.control}
          name="url"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              errorMessage={fieldState.error?.message}
              label="URL"
              placeholder="https://"
              variant="secondary"
            />
          )}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="value"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                errorMessage={fieldState.error?.message}
                label="Valor"
                onChange={(value) => field.onChange(value === '' ? 0 : Number(value))}
                type="number"
                value={String(field.value)}
                variant="secondary"
              />
            )}
          />
          <Controller
            control={form.control}
            name="cpa"
            render={({ field, fieldState }) => (
              <TextField
                errorMessage={fieldState.error?.message}
                label="CPA (opcional)"
                onChange={(value) => field.onChange(value === '' ? null : Number(value))}
                type="number"
                value={field.value === null ? '' : String(field.value)}
                variant="secondary"
              />
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="description"
          render={({ field }) => (
            <TextField {...field} label="Descrição" placeholder="Opcional" variant="secondary" />
          )}
        />

        <Controller
          control={form.control}
          name="imageUploadId"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Imagem</span>
              <RootOfferCoverField
                alt="Imagem do buy link"
                compact
                emptyHint="JPEG, PNG ou WebP, até 10 MB."
                onChange={({ previewUrl, uploadId }) => {
                  form.setValue('imageUrl', previewUrl);
                  field.onChange(uploadId);
                }}
                value={imagePreview ?? ''}
              />
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="isAvailableForAllUsers"
          render={({ field }) => (
            <div className="border-border flex items-center justify-between gap-4 rounded-xl border px-4 py-3">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-medium">Disponível para todos</span>
                <p className="text-muted text-xs leading-snug">
                  Desative para restringir o link a afiliados específicos.
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

        {isOpenToAll ? null : (
          <Controller
            control={form.control}
            name="allowedUserIds"
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Afiliados com acesso</span>
                <RootOfferUsersField onChange={field.onChange} value={field.value} />
              </div>
            )}
          />
        )}
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
