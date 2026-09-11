'use client';

import { Pencil } from '@gravity-ui/icons';
import { AltArrowLeftIcon } from '@solar-icons/react/linear';

import { useState } from 'react';

import { Avatar, Button, Chip } from '@heroui/react';

import type { AffiliationDetail } from '@/store/services/offers/offer-details.types';
import { useSetAffiliationCommissionMutation } from '@/store/services/offers/offers.api';
import { formatCommission } from '@/utils/format-commission';

import { SOURCE_META, STATUS_META } from '../affiliations.constants';
import { AffiliationDetailCommissionDialog } from './affiliation-detail-commission-dialog';
import type { AffiliationCommissionValues } from './affiliation-detail-commission-dialog';

const commission = (
  type: AffiliationDetail['frontCommissionType'],
  value: string,
  currency: string | null,
) => formatCommission(value, type, currency);

interface Props {
  data: AffiliationDetail;
  onBack: () => void;
}

export const AffiliationDetailHeader = ({ data, onBack }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [save, { isLoading, error }] = useSetAffiliationCommissionMutation();
  const meta = STATUS_META[data.status];
  const currency = data.offer?.currency ?? null;

  const onSave = async (values: AffiliationCommissionValues) => {
    await save({ id: data.id, offerId: data.offerId, body: values }).unwrap();
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <Button className="w-fit" onPress={onBack} variant="ghost">
        <AltArrowLeftIcon />
        Afiliados
      </Button>

      <div className="border-border bg-surface flex flex-col gap-5 rounded-2xl border p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="size-16 shrink-0 rounded-xl">
              {data.offer?.imageUrl ? <Avatar.Image alt="" src={data.offer.imageUrl} /> : null}
              <Avatar.Fallback>{data.offer?.title?.charAt(0) ?? '?'}</Avatar.Fallback>
            </Avatar>
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="truncate text-xl font-semibold">
                {data.offer?.title ?? data.offerId}
              </h1>
              <p className="text-muted font-mono text-xs">{data.offer?.code ?? data.code}</p>
              {data.offer?.categoryName ? (
                <p className="text-muted text-xs">{data.offer.categoryName}</p>
              ) : null}
            </div>
          </div>

          <Chip color={meta.color} variant="soft">
            {meta.label}
          </Chip>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <CommissionStat
            label="Front comissão"
            onEdit={() => setIsOpen(true)}
            type={data.frontCommissionType}
            value={commission(data.frontCommissionType, data.frontCommissionValue, currency)}
          />
          <CommissionStat
            label="Back comissão"
            onEdit={() => setIsOpen(true)}
            type={data.backCommissionType}
            value={commission(data.backCommissionType, data.backCommissionValue, currency)}
          />
          <CommissionStat
            label="Recorrência"
            onEdit={() => setIsOpen(true)}
            type={data.recurrenceCommissionType}
            value={commission(
              data.recurrenceCommissionType,
              data.recurrenceCommissionValue,
              currency,
            )}
          />
        </div>

        <p className="text-muted text-xs">
          Termos desta afiliação · {SOURCE_META[data.commissionSource] ?? data.commissionSource} ·{' '}
          {data.code}
        </p>
      </div>

      <AffiliationDetailCommissionDialog
        data={data}
        error={error}
        isOpen={isOpen}
        isSaving={isLoading}
        onOpenChange={setIsOpen}
        onSave={onSave}
      />
    </div>
  );
};

const CommissionStat = ({
  label,
  value,
  type,
  onEdit,
}: {
  label: string;
  value: string;
  type: AffiliationDetail['frontCommissionType'];
  onEdit: () => void;
}) => (
  <div className="bg-surface-secondary flex items-start justify-between gap-2 rounded-xl px-4 py-3">
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-muted text-[10px] font-semibold tracking-wide uppercase">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
      <span className="text-muted text-[11px]">{type === 'REV_SHARE' ? 'Rev Share' : 'CPA'}</span>
    </div>
    <Button aria-label={`Editar ${label}`} isIconOnly onPress={onEdit} size="sm" variant="tertiary">
      <Pencil className="size-4" />
    </Button>
  </div>
);
