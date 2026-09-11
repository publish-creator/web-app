'use client';

import { Button, Tabs } from '@heroui/react';

import { QuerySearchField } from '@/components/composites/search-field';

import { STATUS_TABS } from './invites.constants';

interface Props {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string | number) => void;
  onCreate: () => void;
}

export const RootInvitesFilters = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onCreate,
}: Props) => (
  <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
    <QuerySearchField
      inputValue={search}
      onClear={() => onSearchChange('')}
      onInputChange={onSearchChange}
    />
    <Tabs
      className="w-full min-w-0 lg:w-auto"
      onSelectionChange={onStatusChange}
      selectedKey={status}
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label="Status do convite" className="w-full">
          {STATUS_TABS.map((tab) => (
            <Tabs.Tab id={tab.id} key={tab.id}>
              {tab.label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
    <Button className="lg:ml-auto" onPress={onCreate}>
      Novo convite
    </Button>
  </div>
);
