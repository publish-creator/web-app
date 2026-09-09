import { Button, Card } from '@heroui/react';

/**
 * Affiliating to an offer has no endpoint: it is a module of its own, with state and approval, and
 * the epic puts it outside this scope. The button is visibly disabled with the reason next to it —
 * leaving it live would let someone press a control that silently does nothing.
 */
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
