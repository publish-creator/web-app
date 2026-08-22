import type { OffersListResponse } from '@/store/services/offers/offers.types';
import { formatCurrency } from '@/utils/format-currency';
import { Button, Card } from '@heroui/react';
import { MenuDotsIcon } from '@solar-icons/react/bold';
import { AltArrowLeftIcon, AltArrowRightIcon } from '@solar-icons/react/linear';

interface OffersRecentViewedProps {
  data: OffersListResponse | undefined;
}

export const OffersRecentViewed = ({ data }: OffersRecentViewedProps) => {
  if (!data) return null;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-semibold">Recent Viewed</p>
          <p className="text-muted mt-0.5 text-sm">Viewed offers recently</p>
        </div>
        <div className="flex items-center gap-1">
          <Button isIconOnly size="sm" variant="ghost">
            <AltArrowLeftIcon size="16px" />
          </Button>
          <Button isIconOnly size="sm" variant="ghost">
            <AltArrowRightIcon size="16px" />
          </Button>
          <Button isIconOnly size="sm" variant="ghost">
            <MenuDotsIcon className="rotate-90" size="16px" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {data?.data?.map((offer) => (
          <Card className="flex flex-col gap-1 overflow-hidden rounded-xl p-1 pb-2" key={offer?.id}>
            <div className="bg-surface-secondary aspect-video overflow-hidden rounded-xl">
              <img alt={offer?.title} src={offer?.file ?? 'https://placehold.co/600x400'} />
            </div>
            <div className="px-2">
              <p className="line-clamp-1 text-sm font-bold">{offer.title}</p>
              <div className="mt-0.5 flex items-center justify-between">
                <p className="text-muted text-[12px]">{offer.category.title}</p>
                <p className="text-success text-[12px]">
                  {formatCurrency(offer.commissionValue)} Payout
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
