'use client';

import { Tags } from '@gravity-ui/icons';

import { useState } from 'react';

import { Button, Description, Modal, SearchField, Separator, Spinner } from '@heroui/react';

import { TextField } from '@/components/composites';
import { useGetUserTagsQuery } from '@/store/services/settings';

const PAGE = { page: 1, pageSize: 100 } as const;

export type NewOfferTag = { name: string; active: boolean; userTagIds: string[] };

interface RootOfferTagDialogProps {
  takenNames: string[];
  onAdd: (tag: NewOfferTag) => void;
}

export const RootOfferTagDialog = ({ takenNames, onAdd }: RootOfferTagDialogProps) => {
  const [term, setTerm] = useState('');
  const [name, setName] = useState('');

  const { data: userTags, isFetching } = useGetUserTagsQuery(PAGE);

  const taken = new Set(takenNames.map((entry) => entry.toLowerCase()));
  const rows = (userTags?.data ?? []).filter((tag) =>
    tag.name.toLowerCase().includes(term.trim().toLowerCase()),
  );

  const nameTaken = taken.has(name.trim().toLowerCase());

  return (
    <Modal>
      <Button variant="secondary">Adicionar tag</Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-lg">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon>
                <Tags className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Adicionar tag à oferta</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Usar uma tag que já existe</span>
                  <p className="text-muted text-xs">
                    A oferta passa a ser visível para quem carrega a tag escolhida.
                  </p>
                </div>

                <SearchField
                  aria-label="Buscar tag de usuário"
                  onChange={setTerm}
                  value={term}
                  variant="secondary"
                >
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="Buscar tag" />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>

                <div className="border-border max-h-56 overflow-y-auto rounded-xl border">
                  {isFetching ? (
                    <div className="flex justify-center p-4">
                      <Spinner size="sm" />
                    </div>
                  ) : rows.length === 0 ? (
                    <p className="text-muted p-4 text-sm">Nenhuma tag com esse nome.</p>
                  ) : (
                    rows.map((tag) => {
                      const already = taken.has(tag.name.toLowerCase());

                      return (
                        <div
                          className="flex items-center justify-between gap-3 px-3 py-2"
                          key={tag.id}
                        >
                          <span className="flex flex-col leading-tight">
                            <span className="text-sm font-medium">{tag.name}</span>
                            <span className="text-muted text-xs">
                              {tag.users} {tag.users === 1 ? 'pessoa carrega' : 'pessoas carregam'}
                            </span>
                          </span>
                          <Button
                            isDisabled={already}
                            onPress={() =>
                              onAdd({ name: tag.name, active: true, userTagIds: [tag.id] })
                            }
                            size="sm"
                            {...(already ? {} : { slot: 'close' })}
                            variant="secondary"
                          >
                            {already ? 'Já está na oferta' : 'Adicionar'}
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Criar uma tag nova nesta oferta</span>
                  <p className="text-muted text-xs">
                    Ela nasce sem alcance: escolha depois, na lista, quais tags de usuário ela
                    atinge.
                  </p>
                </div>

                <TextField
                  aria-label="Nome da nova tag"
                  errorMessage={nameTaken ? 'Esta oferta já tem uma tag com esse nome' : undefined}
                  onChange={setName}
                  placeholder="Ex.: black-friday"
                  value={name}
                  variant="secondary"
                />

                <div className="flex justify-end">
                  <Button
                    isDisabled={name.trim().length === 0 || nameTaken}
                    onPress={() => {
                      onAdd({ name: name.trim(), active: true, userTagIds: [] });
                      setName('');
                    }}
                    {...(name.trim().length === 0 || nameTaken ? {} : { slot: 'close' })}
                  >
                    Criar tag
                  </Button>
                </div>

                <Description className="text-xs">
                  Tags de usuário são criadas na tela de usuários, não aqui.
                </Description>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
