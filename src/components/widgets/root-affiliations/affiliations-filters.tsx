'use client';

import { ListBox, SearchField, Select } from '@heroui/react';

import type { AffiliationStatus } from '@/store/services/offers/offer-details.types';
import { RootOfferMultiSelect } from '@/widgets/root-offer';

import { FILTER_ALL, STATUS_META } from './affiliations.constants';

interface Option {
  id: string;
  name: string;
}

interface RootAffiliationsFiltersProps {
  search: string;
  status: string;
  userTagIds: string[];
  userTagOptions: Option[];
  offerIds: string[];
  offerOptions: Option[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onUserTagIdsChange: (ids: string[]) => void;
  onOfferIdsChange: (ids: string[]) => void;
}

const controlClass = 'w-full min-w-0 lg:flex-1';

export const RootAffiliationsFilters = ({
  search,
  status,
  userTagIds,
  userTagOptions,
  offerIds,
  offerOptions,
  onSearchChange,
  onStatusChange,
  onUserTagIdsChange,
  onOfferIdsChange,
}: RootAffiliationsFiltersProps) => (
  <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
    <SearchField
      aria-label="Pesquisar afiliações"
      className={controlClass}
      onChange={onSearchChange}
      value={search}
      variant="secondary"
    >
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input placeholder="Usuário, e-mail ou oferta" />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>

    <Select
      aria-label="Filtrar por status"
      className={controlClass}
      onChange={(next) => {
        if (next != null) onStatusChange(String(next));
      }}
      value={status}
      variant="secondary"
    >
      <Select.Trigger>
        <span className="text-muted text-sm">Status</span>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          <ListBox.Item id={FILTER_ALL} textValue="Todos">
            Todos
            <ListBox.ItemIndicator />
          </ListBox.Item>
          {(Object.keys(STATUS_META) as AffiliationStatus[]).map((id) => (
            <ListBox.Item id={id} key={id} textValue={STATUS_META[id].label}>
              {STATUS_META[id].label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>

    <RootOfferMultiSelect
      className={controlClass}
      label="Tags"
      labelPlacement="inline"
      onChange={onUserTagIdsChange}
      options={userTagOptions}
      placeholder="Todas"
      value={userTagIds}
    />

    <RootOfferMultiSelect
      className={controlClass}
      label="Ofertas"
      labelPlacement="inline"
      onChange={onOfferIdsChange}
      options={offerOptions}
      placeholder="Todas"
      value={offerIds}
    />
  </div>
);
