'use client';

import { Table } from '@heroui/react';

import type { InviteCode } from '@/store/services/users/invite-codes.types';

import {
  InviteCodeCell,
  InviteStatusChip,
  InviteUsesCell,
  InviteValidityCell,
} from './invite-cells';

interface Props {
  rows: InviteCode[];
}

export const RootInvitesTable = ({ rows }: Props) => (
  <Table>
    <Table.ScrollContainer>
      <Table.Content aria-label="Códigos de convite">
        <Table.Header>
          <Table.Column isRowHeader>Código</Table.Column>
          <Table.Column>Validade</Table.Column>
          <Table.Column>Usos</Table.Column>
          <Table.Column>Status</Table.Column>
          <Table.Column>Expira</Table.Column>
          <Table.Column>Criado por</Table.Column>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell className="max-w-52">
                <InviteCodeCell invite={row} />
              </Table.Cell>
              <Table.Cell className="max-w-40">
                <InviteValidityCell invite={row} />
              </Table.Cell>
              <Table.Cell>
                <InviteUsesCell invite={row} />
              </Table.Cell>
              <Table.Cell>
                <InviteStatusChip invite={row} />
              </Table.Cell>
              <Table.Cell className="text-muted max-w-40 truncate text-sm whitespace-nowrap">
                {new Date(row.expiresAt).toLocaleString('pt-BR')}
              </Table.Cell>
              <Table.Cell className="max-w-48">
                <p className="truncate text-sm">{row.invitedBy?.name ?? '—'}</p>
                <p className="text-muted truncate text-xs">{row.invitedBy?.email}</p>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table.ScrollContainer>
  </Table>
);
