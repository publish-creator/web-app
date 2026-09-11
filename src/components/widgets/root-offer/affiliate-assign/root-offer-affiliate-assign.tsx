'use client';

import { Person } from '@gravity-ui/icons';

import { useState } from 'react';

import { Button } from '@heroui/react';

import { useAssignOfferAffiliationMutation } from '@/store/services/offers/offers.api';

import { RootOfferAffiliateDialog } from './root-offer-affiliate-dialog';

export const RootOfferAffiliateAssign = ({ offerId }: { offerId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [assign, { isLoading, error }] = useAssignOfferAffiliationMutation();

  return (
    <>
      <Button onPress={() => setIsOpen(true)} variant="secondary">
        <Person className="size-4" />
        Afiliar usuário
      </Button>
      <RootOfferAffiliateDialog
        error={error}
        isOpen={isOpen}
        isSaving={isLoading}
        onConfirm={async (userId) => {
          await assign({ offerId, userId }).unwrap();
        }}
        onOpenChange={setIsOpen}
      />
    </>
  );
};
