'use client';

import { Xmark } from '@gravity-ui/icons';

import { useMemo, useState } from 'react';

import { Button, SearchField, Spinner } from '@heroui/react';

import { useSearchUsersQuery } from '@/store/services/users';
import type { UserRow } from '@/store/services/users';

const KNOWN_PAGE = { page: 1, pageSize: 100 } as const;

interface RootOfferUsersFieldProps {
  value: string[];
  onChange: (ids: string[]) => void;
}

export const RootOfferUsersField = ({ value, onChange }: RootOfferUsersFieldProps) => {
  const [term, setTerm] = useState('');

  const { data: known } = useSearchUsersQuery(KNOWN_PAGE);
  const { data: found, isFetching } = useSearchUsersQuery(
    term.length >= 2 ? { page: 1, pageSize: 20, filter: term } : KNOWN_PAGE,
  );

  const byId = useMemo(() => {
    const map = new Map<string, UserRow>();

    for (const row of [...(known?.data ?? []), ...(found?.data ?? [])]) map.set(row.id, row);

    return map;
  }, [known, found]);

  const results = (found?.data ?? []).filter((row) => !value.includes(row.id));

  return (
    <div className="flex flex-col gap-2">
      <SearchField
        aria-label="Pesquisar por nome ou e-mail"
        onChange={setTerm}
        value={term}
        variant="secondary"
      >
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input placeholder="Pesquise por nome ou e-mail" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>

      {term.length >= 2 ? (
        <div className="border-border max-h-48 overflow-y-auto rounded-xl border">
          {isFetching ? (
            <div className="flex items-center justify-center p-3">
              <Spinner size="sm" />
            </div>
          ) : results.length === 0 ? (
            <p className="text-muted p-3 text-sm">Ninguém com esse nome ou e-mail.</p>
          ) : (
            results.map((row) => (
              <button
                className="hover:bg-surface-secondary flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left"
                key={row.id}
                onClick={() => {
                  onChange([...value, row.id]);
                  setTerm('');
                }}
                type="button"
              >
                <span className="text-sm font-medium">{row.name}</span>
                <span className="text-muted text-xs">{row.email}</span>
              </button>
            ))
          )}
        </div>
      ) : null}

      {value.length > 0 ? (
        <div className="border-border flex flex-col gap-2 rounded-xl border px-3 py-2.5">
          <span className="text-muted text-xs">
            {value.length} {value.length === 1 ? 'usuário selecionado' : 'usuários selecionados'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {value.map((id) => {
              const row = byId.get(id);

              return (
                <span
                  className="bg-accent/10 text-accent flex items-center gap-1 rounded-full py-1 pr-1 pl-2.5 text-xs"
                  key={id}
                >
                  {row?.name ?? row?.email ?? id}
                  <Button
                    aria-label={`Remover ${row?.name ?? id}`}
                    isIconOnly
                    onPress={() => onChange(value.filter((entry) => entry !== id))}
                    size="sm"
                    variant="tertiary"
                  >
                    <Xmark className="size-3.5" />
                  </Button>
                </span>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
