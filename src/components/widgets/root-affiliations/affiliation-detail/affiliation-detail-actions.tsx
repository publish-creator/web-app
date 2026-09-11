'use client';

import { Check, Xmark } from '@gravity-ui/icons';

import { Button } from '@heroui/react';

import type { AffiliationStatus } from '@/store/services/offers/offer-details.types';

interface Props {
  status: AffiliationStatus;
  isLoading: boolean;
  onDecide: (status: AffiliationStatus) => void;
}

export const AffiliationDetailActions = ({ status, isLoading, onDecide }: Props) => {
  if (status === 'PENDING') {
    return (
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <Button
          fullWidth
          isPending={isLoading}
          onPress={() => onDecide('REJECTED')}
          size="lg"
          variant="danger"
        >
          <Xmark className="size-5 shrink-0" />
          Rejeitar
        </Button>
        <Button fullWidth isPending={isLoading} onPress={() => onDecide('APPROVED')} size="lg">
          <Check className="size-5 shrink-0" />
          Aprovar
        </Button>
      </div>
    );
  }

  if (status === 'APPROVED') {
    return (
      <Button
        fullWidth
        isPending={isLoading}
        onPress={() => onDecide('CANCELED')}
        size="lg"
        variant="danger"
      >
        Cancelar afiliação
      </Button>
    );
  }

  return null;
};
