import { Tabs, Button } from '@heroui/react';
import { AltArrowLeftIcon } from '@solar-icons/react/linear';
import { ShareIcon, HeartIcon } from '@solar-icons/react/bold';

export const OfferHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost">
        <AltArrowLeftIcon />
        Offers
      </Button>
      <div className="flex items-center gap-2">
        <Tabs>
          <Tabs.ListContainer>
            <Tabs.List aria-label="Offer sections">
              <Tabs.Tab>Details</Tabs.Tab>
              <Tabs.Tab>Metrics</Tabs.Tab>
              <Tabs.Tab>publications</Tabs.Tab>
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
