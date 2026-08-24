import { Button, Card } from '@heroui/react';

export const OfferApply = () => {
  return (
    <Card>
      <Card.Content className="flex flex-col gap-4">
        <div className="flex flex-col">
          <p className="text-base font-semibold">Interested in this offer?</p>
          <p className="text-muted text-sm">
            The advertiser reviews applications before handing out links.
          </p>
        </div>
        <Button className="w-full">Apply for access</Button>
      </Card.Content>
    </Card>
  );
};
