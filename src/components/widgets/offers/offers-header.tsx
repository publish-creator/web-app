import { Card } from '@heroui/react';

interface OffersHeaderProps {
  /** Undefined while the listing is still loading. */
  total: number | undefined;
}

/**
 * The counters used to be literals — "309 offers", "11 categories" — and the My/Favorites/Waiting
 * buttons had no endpoint behind them. Only the offer total exists in the API today, so it is the
 * only number here.
 */
export const OffersHeader = ({ total }: OffersHeaderProps) => {
  return (
    <div className="flex flex-col items-center gap-6 pb-8">
      <div className="flex flex-col gap-2 text-center">
        <p className="text-5xl font-bold">
          Find your next <br />
          winning Offers
        </p>
        <p className="text-muted">
          Busque por nome, categoria, país <br /> ou comissão.
        </p>
      </div>
      <div className="flex w-full max-w-160 flex-col gap-4">
        <Card className="hover:bg-surface-hover h-16 w-full rounded-2xl transition-colors duration-300">
          <Card.Content></Card.Content>
        </Card>
      </div>
      {total === undefined ? null : (
        <p className="text-muted text-sm">
          <b className="text-foreground tabular-nums">{total}</b>{' '}
          {total === 1 ? 'oferta disponível' : 'ofertas disponíveis'}
        </p>
      )}
    </div>
  );
};
