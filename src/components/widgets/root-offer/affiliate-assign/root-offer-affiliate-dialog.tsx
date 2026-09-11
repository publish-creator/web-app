'use client';

import { Person } from '@gravity-ui/icons';

import { useState } from 'react';

import { Avatar, Button, ErrorMessage, Modal, SearchField, Spinner } from '@heroui/react';

import { messageFromError } from '@/lib/api/error-message';
import { useSearchUsersQuery } from '@/store/services/users';
import type { UserRow } from '@/store/services/users';

interface RootOfferAffiliateDialogProps {
  isOpen: boolean;
  isSaving: boolean;
  error?: unknown;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: string) => Promise<void>;
}

const initials = (value: string) => value.trim().charAt(0).toUpperCase() || '?';

export const RootOfferAffiliateDialog = ({
  isOpen,
  isSaving,
  error,
  onOpenChange,
  onConfirm,
}: RootOfferAffiliateDialogProps) => {
  const [term, setTerm] = useState('');
  const [picked, setPicked] = useState<UserRow | null>(null);

  const { data: found, isFetching } = useSearchUsersQuery(
    term.length >= 2 ? { page: 1, pageSize: 20, filter: term } : { page: 1, pageSize: 1 },
    { skip: !isOpen || term.length < 2 },
  );

  const results = (found?.data ?? []).filter(
    (row) => row.platformRole === 'AFFILIATE' && row.status === 'ACTIVE',
  );

  const close = (open: boolean) => {
    if (!open) {
      setTerm('');
      setPicked(null);
    }

    onOpenChange(open);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={close}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Afiliar</Modal.Heading>
              <p className="text-muted text-sm">Busque um afiliado ativo e confirme.</p>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-3">
              <SearchField
                aria-label="Pesquisar por nome ou e-mail"
                onChange={(next) => {
                  setTerm(next);
                  setPicked(null);
                }}
                value={term}
                variant="secondary"
              >
                <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input placeholder="Nome ou e-mail" />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>

              {picked ? (
                <div className="border-border flex items-center gap-3 rounded-xl border px-3 py-2">
                  <Avatar className="size-8 shrink-0">
                    <Avatar.Fallback>{initials(picked.name)}</Avatar.Fallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{picked.name}</p>
                    <p className="text-muted truncate text-xs">{picked.email}</p>
                  </div>
                  <Button onPress={() => setPicked(null)} size="sm" variant="tertiary">
                    Trocar
                  </Button>
                </div>
              ) : term.length < 2 ? (
                <p className="text-muted text-xs">Digite pelo menos 2 caracteres.</p>
              ) : (
                <div className="border-border max-h-56 overflow-y-auto rounded-xl border">
                  {isFetching ? (
                    <div className="flex items-center justify-center p-4">
                      <Spinner size="sm" />
                    </div>
                  ) : results.length === 0 ? (
                    <p className="text-muted p-4 text-sm">Nenhum afiliado ativo com esse termo.</p>
                  ) : (
                    results.map((row) => (
                      <button
                        className="hover:bg-surface-secondary flex w-full items-center gap-3 px-3 py-2 text-left"
                        key={row.id}
                        onClick={() => setPicked(row)}
                        type="button"
                      >
                        <Avatar className="size-8 shrink-0">
                          <Avatar.Fallback>{initials(row.name)}</Avatar.Fallback>
                        </Avatar>
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium">{row.name}</span>
                          <span className="text-muted truncate text-xs">{row.email}</span>
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}

              {error ? <ErrorMessage>{messageFromError(error)}</ErrorMessage> : null}
            </Modal.Body>
            <div className="flex justify-end gap-2 px-6 pb-5">
              <Button onPress={() => close(false)} variant="secondary">
                Cancelar
              </Button>
              <Button
                isDisabled={!picked}
                isPending={isSaving}
                onPress={() => {
                  if (!picked) return;

                  void onConfirm(picked.id).then(() => close(false));
                }}
              >
                <Person className="size-4" />
                Afiliar
              </Button>
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
