import { Button } from '@heroui/react';
import { AddCircleIcon } from '@solar-icons/react/bold';

export const CreativeHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold">Creative Library</p>
        <p>Browse videos that spark ideas for your next creative</p>
      </div>
      <Button aria-label="Add Creative">
        <AddCircleIcon />
        Add Creative
      </Button>
    </div>
  );
};
