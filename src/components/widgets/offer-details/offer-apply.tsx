import { Button, Card } from '@heroui/react';

export const OfferApply = () => {
  return (
    <Card>
      <Card.Content className="flex flex-col gap-4">
        <div className="flex flex-col">
          <p className="text-base font-semibold">Interessado nesta oferta?</p>
          <p className="text-muted text-sm">
            O pedido de afiliação ainda não está disponível nesta versão.
          </p>
        </div>
        <Button className="w-full" isDisabled>
          Solicitar acesso
        </Button>
      </Card.Content>
    </Card>
  );
};
