'use client';

import { useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { Button, Skeleton } from '@heroui/react';

import { usePaginationFilter } from '@/hooks/query/filters/use-pagination-filter';
import {
  useGetInviteCodeQuery,
  useRevokeInviteCodeMutation,
  useUpdateInviteCodeMutation,
} from '@/store/services/users';
import type { InviteCodeWriteBody } from '@/store/services/users/invite-codes.types';
import {
  InviteDetailHeader,
  InviteDetailInfo,
  InviteDetailUses,
  RootInvitesDialog,
} from '@/widgets/root-invites';

export function RootInviteDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id ?? '';
  const { page, setPage } = usePaginationFilter({ limit: 20 });
  const { data, isLoading, isError } = useGetInviteCodeQuery(
    { id, page, pageSize: 20 },
    { skip: !id },
  );
  const [updateInvite] = useUpdateInviteCodeMutation();
  const [revokeInvite, { isLoading: isRevoking }] = useRevokeInviteCodeMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const back = () => router.push('/root/invites');

  if (isLoading) {
    return (
      <div className="container-wrapper flex flex-col gap-4">
        <Skeleton className="h-8 w-40 rounded-xl" />
        <Skeleton className="h-52 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container-wrapper flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-lg font-semibold">Convite não encontrado</p>
        <p className="text-muted max-w-96 text-sm">
          O código pode ter sido removido, ou o identificador na URL não corresponde a nenhum.
        </p>
        <Button onPress={back} variant="secondary">
          Voltar para convites
        </Button>
      </div>
    );
  }

  const copy = async () => {
    await navigator.clipboard.writeText(data.signupUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const save = async (body: InviteCodeWriteBody) => {
    await updateInvite({ id: data.id, body }).unwrap();
  };

  return (
    <div className="container-wrapper flex flex-col gap-5">
      <InviteDetailHeader
        copied={copied}
        data={data}
        isRevoking={isRevoking}
        onBack={back}
        onCopy={() => void copy()}
        onEdit={() => setIsOpen(true)}
        onRevoke={() => void revokeInvite(data.id).unwrap()}
      />

      <InviteDetailInfo data={data} />

      <InviteDetailUses meta={data.uses.meta} onPageChange={setPage} uses={data.uses.data} />

      <RootInvitesDialog
        editing={data}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSubmitInvite={save}
      />
    </div>
  );
}
