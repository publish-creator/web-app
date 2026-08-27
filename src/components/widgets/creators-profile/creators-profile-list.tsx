'use client';

import { InstagramIcon, TikTokIcon } from '@/components/base/icons-svg';
import { Chip, Pagination, Table } from '@heroui/react';
import { GalleryBoldIcon } from '@solar-icons/react';
import { BuildingsIcon, RocketIcon } from '@solar-icons/react/bold';
import { useMemo, useState } from 'react';

type CreatorType = 'individual' | 'company';
type CreatorStatus = 'active' | 'pending' | 'paused';
type CreatorNetwork = 'instagram' | 'tiktok';

type CreatorProfile = {
  id: number;
  name: string;
  createdAt: string;
  type: CreatorType;
  network: CreatorNetwork;
  handle: string;
  theme: string[];
  creatives: number;
  publications: number;
  status: CreatorStatus;
};

const columns = [
  { id: 'name', name: 'Name' },
  { id: 'type', name: 'Type' },
  { id: 'account', name: 'Account' },
  { id: 'theme', name: 'Theme' },
  { id: 'creatives', name: 'Creatives' },
  { id: 'publications', name: 'Publications' },
  { id: 'status', name: 'Status' },
] as const;

const creatorsProfiles: CreatorProfile[] = [
  {
    id: 1,
    name: 'Kate Moore',
    createdAt: '2026-08-26T12:00:00',
    type: 'individual',
    network: 'instagram',
    handle: '@kate.moore',
    theme: ['#111111', '#F4F1EA', '#E8B86D'],
    creatives: 32,
    publications: 18,
    status: 'active',
  },
  {
    id: 2,
    name: 'Nova Studio',
    createdAt: '2026-07-14T09:30:00',
    type: 'company',
    network: 'tiktok',
    handle: '@novastudio',
    theme: ['#4D8FF7', '#DF3232', '#0B0B0B'],
    creatives: 86,
    publications: 41,
    status: 'active',
  },
  {
    id: 3,
    name: 'Liam Ortega',
    createdAt: '2026-06-03T16:45:00',
    type: 'individual',
    network: 'tiktok',
    handle: '@liamortega',
    theme: ['#22C55E', '#14532D', '#F8FAFC'],
    creatives: 12,
    publications: 7,
    status: 'pending',
  },
  {
    id: 4,
    name: 'Aether Media',
    createdAt: '2026-04-19T08:10:00',
    type: 'company',
    network: 'instagram',
    handle: '@aethermedia',
    theme: ['#7C3AED', '#F97316', '#111827', '#F9FAFB'],
    creatives: 54,
    publications: 120,
    status: 'paused',
  },
];

const STATUS_CHIP: Record<CreatorStatus, { color: 'success' | 'warning' | 'danger'; label: string }> =
  {
    active: { color: 'success', label: 'Active' },
    pending: { color: 'warning', label: 'Pending' },
    paused: { color: 'danger', label: 'Paused' },
  };

function formatCreatedAt(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function NetworkIcon({ network }: { network: CreatorNetwork }) {
  return network === 'instagram' ? <InstagramIcon /> : <TikTokIcon />;
}

function ThemeSwatches({ colors }: { colors: string[] }) {
  return (
    <div className="flex items-center">
      {colors.map((color, index) => (
        <div
          className="ring-background -ml-2 size-4 rounded-full ring-2 first:ml-0"
          key={`${color}-${index}`}
          style={{ backgroundColor: color, zIndex: colors.length - index }}
        />
      ))}
    </div>
  );
}

function getCreatorCell(creator: CreatorProfile, columnId: (typeof columns)[number]['id']) {
  switch (columnId) {
    case 'name':
      return (
        <div>
          <p className="text-sm font-medium">{creator.name}</p>
          <time className="text-muted text-xs" dateTime={creator.createdAt}>
            {formatCreatedAt(creator.createdAt)}
          </time>
        </div>
      );
    case 'type':
      return creator.type === 'company' ? (
        <Chip className="flex w-fit items-center gap-2">
          Company
          <BuildingsIcon className="text-xs" size={12} />
        </Chip>
      ) : (
        <Chip>Individual</Chip>
      );
    case 'account':
      return (
        <div className="flex items-center gap-2">
          <NetworkIcon network={creator.network} />
          <p className="text-sm font-medium">{creator.handle}</p>
        </div>
      );
    case 'theme':
      return <ThemeSwatches colors={creator.theme} />;
    case 'creatives':
      return (
        <Chip className="flex w-fit items-center gap-2" color="warning">
          {creator.creatives} <GalleryBoldIcon className="text-xs" size={12} />
        </Chip>
      );
    case 'publications':
      return (
        <Chip className="flex w-fit items-center gap-2" color="accent">
          {creator.publications} <RocketIcon className="text-xs" size={12} />
        </Chip>
      );
    case 'status':
      return (
        <Chip color={STATUS_CHIP[creator.status].color}>{STATUS_CHIP[creator.status].label}</Chip>
      );
  }
}

const ROWS_PER_PAGE = 4;

export function CreatorsProfileList() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(creatorsProfiles.length / ROWS_PER_PAGE);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;

    return creatorsProfiles.slice(start, start + ROWS_PER_PAGE);
  }, [page]);

  const start = (page - 1) * ROWS_PER_PAGE + 1;
  const end = Math.min(page * ROWS_PER_PAGE, creatorsProfiles.length);

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Table with pagination" className="min-w-150">
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column isRowHeader={column.id === 'name'}>{column.name}</Table.Column>
            )}
          </Table.Header>
          <Table.Body items={paginatedItems}>
            {(user) => (
              <Table.Row>
                <Table.Collection items={columns}>
                  {(column) => <Table.Cell>{getCreatorCell(user, column.id)}</Table.Cell>}
                </Table.Collection>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      <Table.Footer>
        <Pagination size="sm">
          <Pagination.Summary>
            {start} to {end} of {creatorsProfiles.length} results
          </Pagination.Summary>
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous
                isDisabled={page === 1}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
              >
                <Pagination.PreviousIcon />
                Prev
              </Pagination.Previous>
            </Pagination.Item>
            {pages.map((p) => (
              <Pagination.Item key={p}>
                <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                  {p}
                </Pagination.Link>
              </Pagination.Item>
            ))}
            <Pagination.Item>
              <Pagination.Next
                isDisabled={page === totalPages}
                onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </Table.Footer>
    </Table>
  );
}
