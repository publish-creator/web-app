'use client';

import { Pencil, Plus, TrashBin } from '@gravity-ui/icons';

import { useState } from 'react';

import { Button, Chip } from '@heroui/react';

import type { Coproducer, CoproducerWriteBody } from '@/store/services/offers/offer-details.types';
import {
  useCreateCoproducerMutation,
  useDeleteCoproducerMutation,
  useGetCoproducersQuery,
  useUpdateCoproducerMutation,
} from '@/store/services/offers/offers.api';
import type { Offer } from '@/store/services/offers/offers.types';

import { formatCommissionAmount } from '../auto-affiliation/root-offer-auto-affiliation.form';
import { RootOfferCoproducersDialog } from './root-offer-coproducers-dialog';
import { STATUS_LABEL } from './root-offer-coproducers.form';

interface RootOfferCoproducersTabProps {
  offer: Offer;
}

export const RootOfferCoproducersTab = ({ offer }: RootOfferCoproducersTabProps) => {
  const { data } = useGetCoproducersQuery({ offerId: offer.id, page: 1, pageSize: 50 });
  const [createRow] = useCreateCoproducerMutation();
  const [updateRow] = useUpdateCoproducerMutation();
  const [deleteRow] = useDeleteCoproducerMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Coproducer | null>(null);

  const rows = data?.data ?? [];

  const save = async (body: CoproducerWriteBody) => {
    if (editing) {
      await updateRow({ offerId: offer.id, id: editing.id, body }).unwrap();
      return;
    }

    await createRow({ offerId: offer.id, body }).unwrap();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted max-w-xl text-sm">
          Quem divide a venda desta oferta. Ativo recebe. Pausado fica cadastrado sem receber.
          Cadastrar alguém que já é afiliado aqui recusa essa afiliação.
        </p>
        <Button
          onPress={() => {
            setEditing(null);
            setIsOpen(true);
          }}
        >
          <Plus className="size-4" />
          Novo coprodutor
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-2xl border border-dashed py-16 text-center">
          <p className="text-muted text-sm">Nenhum coprodutor nesta oferta.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <article
              className="border-border flex flex-col gap-3 rounded-2xl border p-4"
              key={row.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{row.user?.name || row.userId}</p>
                  <p className="text-muted truncate text-xs">{row.user?.email}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Chip size="sm" variant={row.status === 'ACTIVE' ? 'soft' : 'secondary'}>
                    {STATUS_LABEL[row.status]}
                  </Chip>
                  <Button
                    onPress={() => {
                      setEditing(row);
                      setIsOpen(true);
                    }}
                    size="sm"
                    variant="tertiary"
                  >
                    <Pencil className="size-4" />
                    Editar
                  </Button>
                  <Button
                    className="text-danger"
                    onPress={() => void deleteRow({ offerId: offer.id, id: row.id })}
                    size="sm"
                    variant="tertiary"
                  >
                    <TrashBin className="size-4" />
                    Remover
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <CommissionCell
                  currency={offer.currency}
                  label="FRONT"
                  type={row.frontCommissionType}
                  value={Number(row.frontCommissionValue)}
                />
                <CommissionCell
                  currency={offer.currency}
                  label="BACK"
                  type={row.backCommissionType}
                  value={Number(row.backCommissionValue)}
                />
                <CommissionCell
                  currency={offer.currency}
                  label="REC."
                  type={row.recurrenceCommissionType}
                  value={Number(row.recurrenceCommissionValue)}
                />
              </div>
              <p className="text-muted text-xs">
                {row.payRefund ? 'Participa de estorno' : 'Não estorna'}
                {' · '}
                {row.payTransactionalTax ? 'Desconta taxa no REV_SHARE' : 'REV_SHARE sem taxa'}
              </p>
            </article>
          ))}
        </div>
      )}

      <RootOfferCoproducersDialog
        editing={editing}
        isOpen={isOpen}
        offerTitle={offer.title}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setEditing(null);
        }}
        onSubmitRule={save}
      />
    </div>
  );
};

const CommissionCell = ({
  label,
  type,
  value,
  currency,
}: {
  label: string;
  type: Coproducer['frontCommissionType'];
  value: number;
  currency: string | null;
}) => (
  <div className="bg-surface-secondary flex items-center justify-between rounded-xl px-3 py-2">
    <div className="flex flex-col">
      <span className="text-muted text-[11px] font-semibold tracking-wide">{label}</span>
      <span className="text-sm font-semibold">{formatCommissionAmount(type, value, currency)}</span>
    </div>
    <Chip color="success" size="sm" variant="soft">
      {type === 'REV_SHARE' ? 'REV' : 'CPA'}
    </Chip>
  </div>
);
