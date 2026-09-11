'use client';

import { Xmark } from '@gravity-ui/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { useState } from 'react';

import { Button, Checkbox, Modal } from '@heroui/react';

import { TextField } from '@/components/composites';
import { useGetUserTagsQuery } from '@/store/services/settings';
import type { UserTag } from '@/store/services/settings';

import { RootOfferChoice } from '../fields';
import { RootOfferAutoAffiliationCommissionRow } from './root-offer-auto-affiliation-commission';
import {
  APPLY_TO_OPTIONS,
  EMPTY_RULE_FORM,
  autoAffiliationFormSchema,
  createBodyFrom,
  formValuesFromRule,
} from './root-offer-auto-affiliation.form';
import type {
  AutoAffiliationFormValues,
  AutomaticAffiliationCreateBody,
  AutomaticAffiliationRule,
} from './root-offer-auto-affiliation.form';

const PAGE = { page: 1, pageSize: 100 } as const;

interface RootOfferAutoAffiliationDialogProps {
  offerTitle: string;
  offerCode: string;
  editing: AutomaticAffiliationRule | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitRule: (body: AutomaticAffiliationCreateBody) => void | Promise<void>;
}

const matchTag = (tags: UserTag[], draft: string) => {
  const needle = draft.trim().toLowerCase();

  if (!needle) return undefined;

  return tags.find((tag) => tag.name.toLowerCase() === needle);
};

export const RootOfferAutoAffiliationDialog = ({
  offerTitle,
  offerCode,
  editing,
  isOpen,
  onOpenChange,
  onSubmitRule,
}: RootOfferAutoAffiliationDialogProps) => (
  <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    <Modal.Backdrop>
      <Modal.Container>
        <Modal.Dialog className="max-h-[90vh] sm:max-w-2xl">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>{editing ? 'Editar regra' : 'Nova regra'}</Modal.Heading>
            <p className="text-muted text-sm">
              {offerTitle} · {offerCode}
            </p>
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
  editing: AutomaticAffiliationRule | null;
  onOpenChange: (open: boolean) => void;
  onSubmitRule: (body: AutomaticAffiliationCreateBody) => void | Promise<void>;
}) => {
  const { data: userTags } = useGetUserTagsQuery(PAGE);
  const [draft, setDraft] = useState('');
  const [tagError, setTagError] = useState<string | undefined>();

  const form = useForm<AutoAffiliationFormValues>({
    resolver: zodResolver(autoAffiliationFormSchema),
    defaultValues: editing ? formValuesFromRule(editing) : EMPTY_RULE_FORM,
  });

  const selectedIds = useWatch({ control: form.control, name: 'userTagIds' }) ?? [];
  const applyTo = useWatch({ control: form.control, name: 'applyTo' }) ?? 'NEW_USERS';
  const sameAsFront = useWatch({ control: form.control, name: 'sameAsFront' }) ?? false;
  const catalog = userTags?.data ?? [];
  const selected = catalog.filter((tag) => selectedIds.includes(tag.id));

  const addTag = (tag: UserTag) => {
    if (selectedIds.includes(tag.id)) return;

    form.setValue('userTagIds', [...selectedIds, tag.id], { shouldValidate: true });
    setDraft('');
    setTagError(undefined);
  };

  const tryAddFromDraft = () => {
    const found = matchTag(catalog, draft);

    if (!found) {
      setTagError(
        draft.trim()
          ? 'Só entram tags de usuário que já existem. Crie a tag na tela de usuários.'
          : 'Inclua pelo menos uma tag.',
      );
      return;
    }

    addTag(found);
  };

  const applyHint = APPLY_TO_OPTIONS.find((option) => option.id === applyTo)?.hint;

  return (
    <>
      <Modal.Body className="flex flex-col gap-5 overflow-y-auto">
        <section className="flex flex-col gap-2">
          <span className="text-sm font-medium">Tags</span>
          <p className="text-muted text-xs">Qualquer uma destas tags aprova o pedido.</p>

          <TextField
            aria-label="Adicionar tag de usuário"
            errorMessage={tagError ?? form.formState.errors.userTagIds?.message}
            onChange={(value) => {
              setDraft(value);
              setTagError(undefined);
            }}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return;

              event.preventDefault();
              tryAddFromDraft();
            }}
            placeholder="Digite e pressione Enter"
            value={draft}
            variant="secondary"
          />

          {draft.trim() ? (
            <div className="border-border max-h-40 overflow-y-auto rounded-xl border">
              {catalog
                .filter(
                  (tag) =>
                    !selectedIds.includes(tag.id) &&
                    tag.name.toLowerCase().includes(draft.trim().toLowerCase()),
                )
                .slice(0, 8)
                .map((tag) => (
                  <button
                    className="hover:bg-surface-secondary flex w-full items-center justify-between px-3 py-2 text-left text-sm"
                    key={tag.id}
                    onClick={() => addTag(tag)}
                    type="button"
                  >
                    <span>{tag.name}</span>
                    <span className="text-muted text-xs">
                      {tag.users} {tag.users === 1 ? 'pessoa' : 'pessoas'}
                    </span>
                  </button>
                ))}
            </div>
          ) : null}

          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selected.map((tag) => (
                <span
                  className="border-border flex items-center gap-1 rounded-full border py-1 pr-1 pl-3 text-xs"
                  key={tag.id}
                >
                  + {tag.name}
                  <Button
                    aria-label={`Remover ${tag.name}`}
                    isIconOnly
                    onPress={() =>
                      form.setValue(
                        'userTagIds',
                        selectedIds.filter((id) => id !== tag.id),
                        { shouldValidate: true },
                      )
                    }
                    size="sm"
                    variant="tertiary"
                  >
                    <Xmark className="size-3.5" />
                  </Button>
                </span>
              ))}
            </div>
          ) : null}
        </section>

        <section className="flex flex-col gap-2">
          <span className="text-sm font-medium">Aplicar em</span>
          <Controller
            control={form.control}
            name="applyTo"
            render={({ field }) => (
              <RootOfferChoice
                columns={3}
                label="Aplicar para"
                onChange={field.onChange}
                options={APPLY_TO_OPTIONS}
                value={field.value}
              />
            )}
          />
          <p className="text-muted text-xs">{applyHint}</p>
        </section>

        <section className="flex flex-col gap-3">
          <span className="text-sm font-medium">Comissão da regra</span>

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
      </Modal.Body>
      <div className="flex justify-end gap-2 px-6 pb-5">
        <Button onPress={() => onOpenChange(false)} variant="secondary">
          Cancelar
        </Button>
        <Button
          onPress={() => {
            void form.handleSubmit(async (values) => {
              await onSubmitRule(createBodyFrom(values));
              onOpenChange(false);
            })();
          }}
        >
          {editing ? 'Salvar regra' : 'Criar regra'}
        </Button>
      </div>
    </>
  );
};
