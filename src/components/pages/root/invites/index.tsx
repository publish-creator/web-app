'use client';

import { useState } from 'react';

import { Pagination } from '@/components/composites/pagination/pagination';
import { usePaginationFilter } from '@/hooks/query/filters/use-pagination-filter';
import { useSearchFilter } from '@/hooks/query/filters/use-search-filter';
import { useTabFilter } from '@/hooks/query/filters/use-tab-filter';
import {
  useCreateInviteCodeMutation,
  useGetInviteCodesQuery,
  useUpdateInviteCodeMutation,
} from '@/store/services/users';
import type {
  InviteCode,
  InviteCodeStatus,
  InviteCodeWriteBody,
} from '@/store/services/users/invite-codes.types';
import {
  FILTER_ALL,
  RootInvitesDialog,
  RootInvitesFilters,
  RootInvitesKpis,
  RootInvitesTable,
} from '@/widgets/root-invites';

const DEFAULT_PAGE_SIZE = 20;

export function RootInvitesPage() {
  const { page, limit, setPage } = usePaginationFilter({ limit: DEFAULT_PAGE_SIZE });
  const { search, inputValue, onInputChange } = useSearchFilter();
  const { tab, setTab } = useTabFilter({
    defaultTab: FILTER_ALL,
    key: 'status',
    resetPageOnChange: true,
  });
  const status = tab ?? FILTER_ALL;

  const listing = useGetInviteCodesQuery({
    page,
    pageSize: limit,
    order: 'desc',
    ...(search ? { filter: search } : {}),
    ...(status === FILTER_ALL ? {} : { status: status as InviteCodeStatus }),
  });
  const [createInvite] = useCreateInviteCodeMutation();
  const [updateInvite] = useUpdateInviteCodeMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<InviteCode | null>(null);

  const rows = listing.data?.data ?? [];
  const meta = listing.data?.meta;

  const save = async (body: InviteCodeWriteBody) => {
    if (editing) {
      await updateInvite({ id: editing.id, body }).unwrap();
      return;
    }

    await createInvite(body).unwrap();
  };

  return (
    <div className="container-wrapper flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Convites</h1>
        <p className="text-muted text-sm">
          Códigos e links de entrada. Quem usou, quando, e até quando vale.
        </p>
      </div>

      <RootInvitesKpis counts={listing.data?.counts} />
      <RootInvitesFilters
        onCreate={() => {
          setEditing(null);
          setIsOpen(true);
        }}
        onSearchChange={onInputChange}
        onStatusChange={(value) => setTab(String(value))}
        search={inputValue}
        status={status}
      />

      {listing.isLoading ? (
        <p className="text-muted text-sm">Carregando convites…</p>
      ) : rows.length === 0 ? (
        <p className="text-muted text-sm">Nenhum convite neste recorte.</p>
      ) : (
        <RootInvitesTable rows={rows} />
      )}

      {meta && (meta.totalPages > 1 || meta.page > 1) ? (
        <Pagination
          onPageChange={setPage}
          page={meta.page}
          pageSize={meta.pageSize}
          total={meta.total}
          totalPages={meta.totalPages}
        />
      ) : null}

      <RootInvitesDialog
        editing={editing}
        isOpen={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setEditing(null);
        }}
        onSubmitInvite={save}
      />
    </div>
  );
}
