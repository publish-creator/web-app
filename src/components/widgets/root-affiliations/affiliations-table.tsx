'use client';

import { EllipsisVertical } from '@gravity-ui/icons';

import Link from 'next/link';

import { Button, Chip, Dropdown, Label, Table } from '@heroui/react';

import type {
  AdminAffiliation,
  AffiliationStatus,
} from '@/store/services/offers/offer-details.types';
import { formatCommissionAmount } from '@/widgets/root-offer';

import { STATUS_META } from './affiliations.constants';

const relativeFrom = (iso: string) => {
  const days = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000));

  if (days === 0) return 'hoje';
  if (days === 1) return 'há 1 dia';

  return `há ${days} dias`;
};

const Stack = ({
  href,
  title,
  subtitle,
  mono,
}: {
  href?: string;
  title: string;
  subtitle: string;
  mono?: boolean;
}) => {
  const body = (
    <>
      <span className="truncate text-sm font-semibold">{title}</span>
      <span className={`text-muted truncate text-xs ${mono ? 'font-mono' : ''}`}>{subtitle}</span>
    </>
  );

  if (!href) {
    return <div className="flex max-w-52 min-w-0 flex-col">{body}</div>;
  }

  return (
    <Link className="flex max-w-52 min-w-0 flex-col" href={href}>
      {body}
    </Link>
  );
};

const commissionCell = (
  type: AdminAffiliation['frontCommissionType'],
  value: string,
  currency: string | null,
) => (
  <div className="flex max-w-32 min-w-0 flex-col">
    <span className="truncate text-sm font-medium">
      {formatCommissionAmount(type, Number(value), currency)}
    </span>
    <span className="text-muted text-[11px]">{type === 'REV_SHARE' ? 'Rev Share' : 'CPA'}</span>
  </div>
);

const DecisionCell = ({ row }: { row: AdminAffiliation }) => {
  if (!row.decidedAt) {
    return <span className="text-muted text-xs">Aguardando</span>;
  }

  return (
    <div className="flex max-w-44 min-w-0 flex-col">
      <span className="truncate text-sm">{row.decidedBy?.name ?? 'Automático'}</span>
      <span className="text-muted truncate text-xs">{row.decidedBy?.email ?? 'Sem operador'}</span>
      <span className="text-muted truncate text-xs">
        {new Date(row.decidedAt).toLocaleString('pt-BR')}
      </span>
    </div>
  );
};

const RowActions = ({
  status,
  onDecide,
}: {
  status: AffiliationStatus;
  onDecide: (status: AffiliationStatus) => void;
}) => {
  if (status !== 'PENDING' && status !== 'APPROVED') return null;

  return (
    <Dropdown>
      <Button aria-label="Ações da afiliação" isIconOnly size="sm" variant="tertiary">
        <EllipsisVertical className="size-4" />
      </Button>
      <Dropdown.Popover className="min-w-40" placement="bottom end">
        <Dropdown.Menu
          onAction={(key) => {
            if (key === 'APPROVED' || key === 'REJECTED' || key === 'CANCELED') onDecide(key);
          }}
        >
          {status === 'PENDING' ? (
            <>
              <Dropdown.Item id="APPROVED" textValue="Aprovar">
                <Label>Aprovar</Label>
              </Dropdown.Item>
              <Dropdown.Item id="REJECTED" textValue="Recusar">
                <Label>Recusar</Label>
              </Dropdown.Item>
            </>
          ) : (
            <Dropdown.Item id="CANCELED" textValue="Cancelar" variant="danger">
              <Label>Cancelar</Label>
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};

interface RootAffiliationsTableProps {
  rows: AdminAffiliation[];
  onDecide: (row: AdminAffiliation, status: AffiliationStatus) => void;
}

export const RootAffiliationsTable = ({ rows, onDecide }: RootAffiliationsTableProps) => (
  <Table>
    <Table.ScrollContainer>
      <Table.Content aria-label="Solicitações de afiliação">
        <Table.Header>
          <Table.Column isRowHeader>Usuário</Table.Column>
          <Table.Column>Tags</Table.Column>
          <Table.Column>Oferta</Table.Column>
          <Table.Column>Status</Table.Column>
          <Table.Column>Decisão</Table.Column>
          <Table.Column>Categoria</Table.Column>
          <Table.Column>Moeda</Table.Column>
          <Table.Column>Comissão Front</Table.Column>
          <Table.Column>Comissão Back</Table.Column>
          <Table.Column>Comissão Rec.</Table.Column>
          <Table.Column>Data</Table.Column>
          <Table.Column>Ações</Table.Column>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => {
            const meta = STATUS_META[row.status];
            const currency = row.offer?.currency ?? null;
            const extraTags = Math.max(0, row.tags.length - 1);
            const when = new Date(row.requestedAt);

            return (
              <Table.Row key={row.id}>
                <Table.Cell className="max-w-52">
                  <Stack
                    href={`/root/affiliations/${row.id}`}
                    subtitle={row.user?.email ?? '—'}
                    title={row.user?.name ?? row.userId}
                  />
                </Table.Cell>
                <Table.Cell className="max-w-40">
                  {row.tags.length === 0 ? (
                    <span className="text-muted text-sm">—</span>
                  ) : (
                    <div className="flex min-w-0 items-center gap-1">
                      <Chip className="max-w-28" size="sm" variant="soft">
                        <span className="truncate">{row.tags[0]?.name}</span>
                      </Chip>
                      {extraTags > 0 ? (
                        <Chip size="sm" variant="soft">
                          +{extraTags}
                        </Chip>
                      ) : null}
                    </div>
                  )}
                </Table.Cell>
                <Table.Cell className="max-w-52">
                  {row.offer ? (
                    <Stack
                      href={`/root/offers/${row.offer.id}`}
                      mono
                      subtitle={row.offer.code}
                      title={row.offer.title}
                    />
                  ) : (
                    <p className="text-muted max-w-52 truncate text-sm">{row.offerId}</p>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Chip color={meta.color} size="sm" variant="soft">
                    {meta.label}
                  </Chip>
                </Table.Cell>
                <Table.Cell className="max-w-44">
                  <DecisionCell row={row} />
                </Table.Cell>
                <Table.Cell className="max-w-36">
                  <span className="text-muted block truncate text-xs">
                    {row.offer?.categoryName || '—'}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-sm">{row.offer?.currency || '—'}</span>
                </Table.Cell>
                <Table.Cell>
                  {commissionCell(row.frontCommissionType, row.frontCommissionValue, currency)}
                </Table.Cell>
                <Table.Cell>
                  {commissionCell(row.backCommissionType, row.backCommissionValue, currency)}
                </Table.Cell>
                <Table.Cell>
                  {commissionCell(
                    row.recurrenceCommissionType,
                    row.recurrenceCommissionValue,
                    currency,
                  )}
                </Table.Cell>
                <Table.Cell className="max-w-32">
                  <div className="text-muted flex flex-col text-xs">
                    <span className="truncate">{when.toLocaleDateString('pt-BR')}</span>
                    <span className="truncate">
                      {when.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="truncate">{relativeFrom(row.requestedAt)}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <RowActions onDecide={(status) => onDecide(row, status)} status={row.status} />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Content>
    </Table.ScrollContainer>
  </Table>
);
