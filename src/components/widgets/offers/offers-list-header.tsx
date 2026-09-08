import { Widget4Icon } from '@solar-icons/react/bold';
import { CheckCircleIcon, SliderMinimalisticHorizontalIcon } from '@solar-icons/react/bold-duotone';

import { useState } from 'react';

import { Button, Tag, TagGroup, ToggleButton, ToggleButtonGroup } from '@heroui/react';

const COUNTRIES = [
  {
    id: 'us',
    name: 'United States',
    icon: 'https://hatscripts.github.io/circle-flags/flags/us.svg',
  },
  {
    id: 'gb',
    name: 'United Kingdom',
    icon: 'https://hatscripts.github.io/circle-flags/flags/gb.svg',
  },
  {
    id: 'ca',
    name: 'Canada',
    icon: 'https://hatscripts.github.io/circle-flags/flags/ca.svg',
  },
  {
    id: 'au',
    name: 'Australia',
    icon: 'https://hatscripts.github.io/circle-flags/flags/au.svg',
  },
  {
    id: 'pl',
    name: 'Poland',
    icon: 'https://hatscripts.github.io/circle-flags/flags/pl.svg',
  },
];

const toggleClass =
  'rounded-full bg-transparent text-muted data-[selected=true]:bg-surface-secondary data-[selected=true]:text-muted';

interface OffersListHeaderProps {
  /** Undefined while the listing is still loading. */
  total: number | undefined;
}

export const OffersListHeader = ({ total }: OffersListHeaderProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string[]>([]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-semibold">All Offers</p>
          <p className="text-muted mt-0.5 text-sm tabular-nums">
            {total === undefined ? ' ' : `${total} ${total === 1 ? 'oferta' : 'ofertas'}`}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button className="text-xs" variant="tertiary">
            <span className="text-muted">Sort</span> Recommended
          </Button>
          <ToggleButtonGroup
            aria-label="Text formatting"
            className="bg-surface gap-1 rounded-full p-1"
            selectionMode="single"
            size="sm"
          >
            <ToggleButton aria-label="Bold" className={toggleClass} id="bold" isIconOnly>
              <Widget4Icon size="16px" />
            </ToggleButton>
            <ToggleButton aria-label="Italic" className={toggleClass} id="italic" isIconOnly>
              <SliderMinimalisticHorizontalIcon size="16px" />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
      <TagGroup
        aria-label="Tags"
        onSelectionChange={(keys) => setSelectedCountry(Array.from(keys) as string[])}
        selectedKeys={selectedCountry}
        selectionMode="multiple"
        size="lg"
        variant="surface"
      >
        <TagGroup.List>
          {COUNTRIES.map((country) => (
            <Tag
              className="data-[selected=true]:bg-surface-secondary data-[selected=true]:text-foreground"
              id={country.id}
              key={country.id}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- offer covers, flags and category icons come from arbitrary hosts an admin pastes; next/image would need every one allowlisted */}
              <img alt="" className="size-4 shrink-0 rounded-full" src={country.icon} />
              {country.name}
              {selectedCountry.includes(country.id) && <CheckCircleIcon size="16px" />}
            </Tag>
          ))}
        </TagGroup.List>
      </TagGroup>
    </div>
  );
};
