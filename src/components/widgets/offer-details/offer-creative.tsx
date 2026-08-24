import { Button } from '@heroui/react';
import { CreativeCard } from '../creative/creative-card';

export const OfferCreative = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold">Creatives offers</p>
        <Button variant="secondary">Create</Button>
      </div>
      <div className="grid w-full grid-cols-3 gap-2">
        {Array.from({ length: 9 }).map((item, index) => (
          <CreativeCard key={index} />
        ))}
      </div>
    </div>
  );
};
