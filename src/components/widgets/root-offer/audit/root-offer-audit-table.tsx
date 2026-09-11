'use client';

import Link from 'next/link';

import { Chip, Table } from '@heroui/react';

import type { OfferAuditEntry } from '@/store/services/offers/offer-details.types';

import { AUDIT_ACTION_META, AUDIT_ENTITY_LABEL } from './root-offer-audit.labels';

interface Props {
  offerId: string;
  rows: OfferAuditEntry[];
}

export const RootOfferAuditTable = ({ offerId, rows }: Props) => (
  <Table>
    <Table.ScrollContainer>
      <Table.Content aria-label="Auditoria da oferta">
        <Table.Header>
          <Table.Column isRowHeader>Quando</Table.Column>
          <Table.Column>O quê</Table.Column>
          <Table.Column>Ação</Table.Column>
          <Table.Column>Quem</Table.Column>
          <Table.Column>Requisição</Table.Column>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => {
            const action = AUDIT_ACTION_META[row.action];
            const when = new Date(row.changedAt);
            const who = row.changedBy;
            const href = `/root/offers/${offerId}/audit/${row.id}`;

            return (
              <Table.Row key={row.id}>
                <Table.Cell className="max-w-40">
                  <Link className="flex max-w-40 min-w-0 flex-col" href={href}>
                    <span className="truncate text-sm font-semibold">
                      {when.toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-muted truncate text-xs">
                      {when.toLocaleTimeString('pt-BR')}
                    </span>
                  </Link>
                </Table.Cell>
                <Table.Cell className="max-w-52">
                  <Link className="flex max-w-52 min-w-0 flex-col" href={href}>
                    <span className="truncate text-sm font-medium">
                      {AUDIT_ENTITY_LABEL[row.entity] ?? row.entity}
                    </span>
                    <span className="text-muted truncate font-mono text-xs">{row.entityId}</span>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Chip color={action.color} size="sm" variant="soft">
                    {action.label}
                  </Chip>
                </Table.Cell>
                <Table.Cell className="max-w-48">
                  <p className="truncate text-sm">{who?.name ?? row.changedById}</p>
                  <p className="text-muted truncate text-xs">{who?.email ?? row.changedByRole}</p>
                </Table.Cell>
                <Table.Cell className="max-w-52">
                  <p className="truncate font-mono text-sm">
                    {row.method} {row.path}
                  </p>
                  <p className="text-muted truncate text-xs">{row.ipAddress || 'sem IP'}</p>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Content>
    </Table.ScrollContainer>
  </Table>
);
