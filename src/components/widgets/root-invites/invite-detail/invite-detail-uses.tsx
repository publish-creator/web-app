'use client';

import { Table } from '@heroui/react';

import { Pagination } from '@/components/composites/pagination/pagination';
import type { PaginatedResponse } from '@/store/services/types';
import type { InviteCodeUse } from '@/store/services/users/invite-codes.types';

interface Props {
  uses: InviteCodeUse[];
  meta: PaginatedResponse<InviteCodeUse>['meta'];
  onPageChange: (page: number) => void;
}

export const InviteDetailUses = ({ uses, meta, onPageChange }: Props) => (
  <section className="flex flex-col gap-3">
    <div>
      <h2 className="text-sm font-semibold">Quem entrou</h2>
      <p className="text-muted text-xs">
        Cadastros feitos com este código, do mais recente ao mais antigo.
      </p>
    </div>

    {uses.length === 0 ? (
      <p className="text-muted text-sm">Ninguém usou este código ainda.</p>
    ) : (
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Quem usou o convite">
            <Table.Header>
              <Table.Column isRowHeader>Pessoa</Table.Column>
              <Table.Column>Entrou em</Table.Column>
              <Table.Column>IP</Table.Column>
            </Table.Header>
            <Table.Body>
              {uses.map((use) => (
                <Table.Row key={use.id}>
                  <Table.Cell className="max-w-52">
                    <p className="truncate text-sm font-semibold">{use.user?.name ?? use.userId}</p>
                    <p className="text-muted truncate text-xs">{use.user?.email ?? '—'}</p>
                  </Table.Cell>
                  <Table.Cell className="text-muted max-w-40 truncate text-sm whitespace-nowrap">
                    {new Date(use.usedAt).toLocaleString('pt-BR')}
                  </Table.Cell>
                  <Table.Cell className="max-w-36">
                    <span className="block truncate font-mono text-xs">{use.ipAddress || '—'}</span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    )}

    {meta.totalPages > 1 ? (
      <Pagination
        onPageChange={onPageChange}
        page={meta.page}
        pageSize={meta.pageSize}
        total={meta.total}
        totalPages={meta.totalPages}
      />
    ) : null}
  </section>
);
