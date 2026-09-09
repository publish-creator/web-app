import { Card } from '@heroui/react';

interface OffersHeaderProps {
  total: number | undefined;
}

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
