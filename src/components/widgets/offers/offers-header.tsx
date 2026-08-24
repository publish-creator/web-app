import { Button, Card } from '@heroui/react';
import { HeartIcon, HourglassLineIcon, RocketIcon } from '@solar-icons/react/bold';

const AS_OPTIONS = [
  { icon: RocketIcon, label: 'My' },
  { icon: HeartIcon, label: 'Favorites' },
  { icon: HourglassLineIcon, label: 'Waiting' },
];

export const OffersHeader = () => {
  return (
    <div className="flex flex-col items-center gap-6 pb-8">
      <div className="flex flex-col gap-2 text-center">
        <p className="text-5xl font-bold">
          Find your next <br />
          winning Offers
        </p>
        <p className="text-muted">
          Browse 309+ offers across every vertical. Search by <br /> name, category, country, or
          payout.
        </p>
      </div>
      <div className="flex w-full max-w-160 flex-col gap-4">
        <Card className="hover:bg-surface-hover h-16 w-full rounded-2xl transition-colors duration-300">
          <Card.Content></Card.Content>
        </Card>
        <div className="mx-auto flex gap-2">
          {AS_OPTIONS.map((option) => (
            <Button className="text-muted" key={option.label} size="sm" variant="tertiary">
              <option.icon />
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-muted text-sm">
          <b className="text-foreground"> 309</b> offers
        </p>
        <span className="text-sm"> ✦</span>
        <p className="text-muted text-sm">
          <b className="text-foreground"> 11</b> categories
        </p>
        <span className="text-sm"> ✦</span>
        <p className="text-muted text-sm">
          <b className="text-foreground"> 180+</b> countries
        </p>
      </div>
    </div>
  );
};
