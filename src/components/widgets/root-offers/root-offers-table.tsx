'use client';

import { Button } from '@heroui/react';

import type { Offer, OffersListResponse } from '@/store/services/offers/offers.types';
import { formatCommission } from '@/utils/format-commission';

import { STATUS_LABEL, STATUS_TONE } from './root-offers.constants';

interface RootOffersTableProps {
  data: OffersListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  hasFilters: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
}

const SKELETON_ROWS = 8;

const COLUMNS = ['Oferta', 'Status', 'Categoria', 'Comissão', 'Alcance', 'Criada em'];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(value));

const reachOf = (offer: Offer) => {
  if (offer.isAvailableForAllUsers) return 'Aberta a todos';

  const countries = offer.countries.length ? `${offer.countries.length} país(es)` : null;
  const chosen = offer.allowedUserIds.length ? `${offer.allowedUserIds.length} usuário(s)` : null;
  const tags = offer.tags.length ? `${offer.tags.length} tag(s)` : null;

  return [countries, chosen, tags].filter(Boolean).join(' · ') || 'Privada, sem alcance';
};

export const RootOffersTable = ({
  data,
  isLoading,
  isError,
  hasFilters,
  onRetry,
  onClearFilters,
}: RootOffersTableProps) => {
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm font-medium">Não foi possível carregar as ofertas.</p>
        <p className="text-muted max-w-96 text-sm">
          Verifique sua conexão e tente novamente. Se continuar, o serviço pode estar fora do ar.
        </p>
        <Button onPress={onRetry} variant="secondary">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!isLoading && data && data.data.length === 0) {
    return hasFilters ? (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm font-medium">Nenhuma oferta encontrada com esses filtros.</p>
        <p className="text-muted max-w-96 text-sm">
          O catálogo não está vazio — só não há nada que combine com o que você procurou.
        </p>
        <Button onPress={onClearFilters} variant="secondary">
          Limpar filtros
        </Button>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm font-medium">Nenhuma oferta cadastrada ainda.</p>
        <p className="text-muted max-w-96 text-sm">
          Quando a primeira for criada, ela aparece aqui com rascunho, publicada e inativa juntas.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border overflow-x-auto rounded-2xl border">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-surface-secondary">
          <tr>
            {COLUMNS.map((column) => (
              <th className="text-muted px-4 py-3 font-medium" key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: SKELETON_ROWS }, (_, index) => (
                <tr className="border-border border-t" key={index}>
                  {COLUMNS.map((column) => (
                    <td className="px-4 py-4" key={column}>
                      <div aria-hidden className="bg-surface-secondary h-4 animate-pulse rounded" />
                    </td>
                  ))}
                </tr>
              ))
            : data?.data.map((offer) => (
                <tr className="border-border border-t" key={offer.id}>
                  <td className="px-4 py-4">
                    <p className="font-medium">{offer.title}</p>
                    <p className="text-muted text-xs">{offer.code}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_TONE[offer.status]}`}
                    >
                      {STATUS_LABEL[offer.status]}
                    </span>
                  </td>
                  <td className="text-muted px-4 py-4">{offer.category?.name ?? '—'}</td>
                  <td className="px-4 py-4">
                    {formatCommission(
                      offer.frontCommissionValue,
                      offer.frontCommissionType,
                      offer.currency,
                    )}
                    <span className="text-muted ml-1 text-xs">{offer.frontCommissionType}</span>
                  </td>
                  <td className="text-muted px-4 py-4">{reachOf(offer)}</td>
                  <td className="text-muted px-4 py-4">{formatDate(offer.createdAt)}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};
