import { formatCurrency } from '@/utils/format-currency';
import { Button, Card } from '@heroui/react';
import { MenuDotsIcon } from '@solar-icons/react/bold';
import { AltArrowLeftIcon, AltArrowRightIcon } from '@solar-icons/react/linear';

export const OffersRecentViewed = () => {
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
        {Array.from({ length: 7 }).map((_, index) => (
          <Card className="flex flex-col gap-1 overflow-hidden rounded-xl p-1 pb-2" key={index}>
            <div className="bg-surface-secondary aspect-video rounded-xl" />
            <div className="px-2">
              <p className="line-clamp-1 text-sm font-bold">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo temporibus reiciendis
                nemo, ipsam omnis eveniet est error provident ipsa modi voluptatum rem et voluptatem
                maiores, non quos cupiditate officiis similique!
              </p>
              <div className="mt-0.5 flex items-center justify-between">
                <p className="text-muted text-[12px]">Category</p>
                <p className="text-success text-[12px]">{formatCurrency(10)} Payout</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
