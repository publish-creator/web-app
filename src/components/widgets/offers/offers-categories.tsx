import type { OffersCategoryListResponse } from '@/store/services/offers-category/offers-category.types';
import { Card } from '@heroui/react';

interface OffersCategoriesProps {
  data: OffersCategoryListResponse | undefined;
}

export const OffersCategories = ({ data }: OffersCategoriesProps) => {
  if (!data) return null;
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xl font-semibold">Categories</p>
        <p className="text-muted mt-0.5 text-sm">Filter the catalog by vertical</p>
      </div>
      <div className="flex flex-wrap gap-4">
        {data.data.map((category) => (
          <Card
            className="hover:bg-surface-hover flex h-19.25 cursor-pointer flex-row gap-6 overflow-hidden rounded-lg transition-colors duration-300"
            key={category.id}
          >
            <div>
              <p className="text-[15px] font-bold">{category.title}</p>
              <p className="text-muted text-xs">{category._count.offers} offers</p>
            </div>
            <div className="-mr-4 -mb-4 size-[78px] min-h-[78px] min-w-[78px] rounded-lg">
              <img
                alt={category.title}
                src={category?.image?.url ?? 'https://placehold.co/78x78'}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
