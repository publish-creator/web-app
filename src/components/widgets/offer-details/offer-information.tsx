import { formatCurrency } from '@/utils/format-currency';
import { Chip } from '@heroui/react';

export const OfferInformation = () => {
  return (
    <div className="flex items-center gap-4">
      <img
        alt="Offer"
        className="aspect-video max-h-[140px] max-w-[280px] rounded-md"
        src="https://placehold.co/1280x720"
      />
      <div className="flex flex-col gap-3">
        <p className="text-2xl font-semibold">Nome da oferta</p>
        <div className="flex items-center gap-2">
          <Chip color="success" variant="secondary">
            {formatCurrency(100)}
          </Chip>
          <Chip className="text-muted" variant="secondary">
            CPA
          </Chip>
          <Chip className="text-muted" variant="secondary">
            Category
          </Chip>
          <Chip color="warning" variant="secondary">
            Approved Required
          </Chip>
        </div>
        <img alt="Avatar" className="size-6 rounded-full" src="https://placehold.co/32x32" />
      </div>
    </div>
  );
};
