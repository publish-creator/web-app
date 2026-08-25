'use client';

import { Tabs, Button } from '@heroui/react';
import { AltArrowLeftIcon } from '@solar-icons/react/linear';
import { ShareIcon, HeartIcon } from '@solar-icons/react/bold';
import { useParams } from 'next/navigation';

export const OfferHeader = () => {
  const { id } = useParams();
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost">
        <AltArrowLeftIcon />
        Offers
      </Button>
      <div className="flex items-center gap-2">
        <Tabs
          onSelectionChange={(value) => {
            console.log(value);
          }}
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Offer sections">
              <Tabs.Tab href={`/offers/${id}`}>Details</Tabs.Tab>
              <Tabs.Tab href={`/offers/${id}/metrics`}>Metrics</Tabs.Tab>
              <Tabs.Tab href={`/offers/${id}/publications`}>publications</Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
        <Button variant="tertiary">
          <ShareIcon />
          Shared
        </Button>
        <Button aria-label="Toggle favorite" isIconOnly variant="tertiary">
          <HeartIcon />
        </Button>
      </div>
    </div>
  );
};
