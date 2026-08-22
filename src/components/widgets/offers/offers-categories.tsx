import { Card } from '@heroui/react';

export const OffersCategories = () => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xl font-semibold">Categories</p>
        <p className="text-muted mt-0.5 text-sm">Filter the catalog by vertical</p>
      </div>
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card className="flex h-19.25 flex-row gap-6 overflow-hidden rounded-lg" key={index}>
            <div>
              <p className="text-[15px] font-bold">Category {index + 1}</p>
              <p className="text-muted text-xs">66 offers</p>
            </div>
            <div className="bg-surface-secondary -mr-4 -mb-4 size-[78px] min-h-[78px] min-w-[78px] rounded-lg" />
          </Card>
        ))}
      </div>
    </div>
  );
};
