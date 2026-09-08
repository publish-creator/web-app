'use client';

import { InfoCircleIcon } from '@solar-icons/react/linear';

import { useLayoutEffect, useRef, useState } from 'react';

import { Button, Card } from '@heroui/react';

import type { Offer } from '@/store/services/offers/offers.types';
import { formatCommission } from '@/utils/format-commission';

interface OfferListCardProps {
  data: Offer;
  onPress: () => void;
}

const VISIBLE_COUNTRIES = 3;
const OUTER_RADIUS = 10;
const INNER_RADIUS = 5.5;
const NOTCH_HEIGHT = 18;
const TITLE_LEFT = 4;
const BEVEL = 15;
const INFO_BUTTON_RESERVE = 52;
const MIN_NOTCH_WIDTH = 48;

/** The API stores ISO-3166 alpha-2 in uppercase; the flag service serves them lowercase. */
function getCircleFlagUrl(country: string): string {
  return `https://hatscripts.github.io/circle-flags/flags/${country.trim().toLowerCase()}.svg`;
}

function buildOfferImageMask(width: number, height: number, notchWidth: number): string {
  const w = Math.max(width, 1);
  const h = Math.max(height, 1);
  const r = OUTER_RADIUS;
  const ir = INNER_RADIUS;
  const innerY = h - NOTCH_HEIGHT;
  const tab = Math.min(
    Math.max(notchWidth, MIN_NOTCH_WIDTH),
    Math.max(w - INFO_BUTTON_RESERVE, MIN_NOTCH_WIDTH),
  );

  const path = [
    `M${r},0`,
    `H${w - r}`,
    `A${r},${r} 0,0,1 ${w},${r}`,
    `V${h - r}`,
    `A${r},${r} 0,0,1 ${w - r},${h}`,
    `H${tab}`,
    `A${ir},${ir} 0,0,1 ${tab - 5.1},${h - 3.4}`,
    `L${tab - 9.6},${h - 14.5}`,
    `A${ir},${ir} 0,0,0 ${tab - BEVEL},${innerY}`,
    `H${ir}`,
    `A${ir},${ir} 0,0,1 0,${innerY - ir}`,
    `V${r}`,
    `A${r},${r} 0,0,1 ${r},0`,
    'Z',
  ].join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><path d="${path}" fill="white"/></svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") center / 100% 100% no-repeat`;
}

export const OfferListCard = ({ data, onPress }: OfferListCardProps) => {
  const mediaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const [mask, setMask] = useState(() => buildOfferImageMask(488, 244, 179));

  const countries = data.countries ?? [];
  const visibleCountries = countries.slice(0, VISIBLE_COUNTRIES);
  const extraCountries = Math.max(countries.length - VISIBLE_COUNTRIES, 0);

  useLayoutEffect(() => {
    const media = mediaRef.current;
    const title = titleRef.current;

    if (!media || !title) return;

    const updateMask = () => {
      const { width, height } = media.getBoundingClientRect();
      const titleWidth = title.getBoundingClientRect().width;

      setMask(buildOfferImageMask(width, height, TITLE_LEFT + titleWidth + BEVEL + 8));
    };

    updateMask();

    const observer = new ResizeObserver(updateMask);

    observer.observe(media);
    observer.observe(title);

    return () => observer.disconnect();
  }, [data.title]);

  return (
    <Card
      className="group hover:bg-surface-hover relative flex h-full flex-col overflow-hidden rounded-2xl p-1.5 pb-2.5"
      onClick={onPress}
    >
      <div className="relative w-full" ref={mediaRef} style={{ aspectRatio: '2 / 1' }}>
        <div
          className="bg-surface-secondary absolute inset-0 overflow-hidden rounded-lg"
          style={{
            mask,
            WebkitMask: mask,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- offer covers, flags and category icons come from arbitrary hosts an admin pastes; next/image would need every one allowlisted */}
          <img
            alt={data.title}
            className="absolute inset-0 size-full object-cover select-none"
            decoding="async"
            draggable={false}
            loading="lazy"
            src={data.imageUrl ?? 'https://placehold.co/600x300'}
          />
        </div>

        <div className="absolute -bottom-0.75 left-1 z-5 flex h-4.5 max-w-[calc(100%-3.25rem)] items-end">
          <span
            className="block w-fit max-w-full truncate text-[15px] leading-none font-semibold"
            ref={titleRef}
          >
            {data.title}
          </span>
        </div>

        <Button
          aria-label="Show offer details"
          className="bg-surface-secondary absolute right-2 bottom-2 z-10 size-8 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          isIconOnly
          size="sm"
          variant="secondary"
        >
          <InfoCircleIcon size={18} />
        </Button>
      </div>
      <div className="absolute top-3 right-3 z-10">
        <Button size="sm" variant="tertiary">
          Apply
        </Button>
      </div>

      <div className="mt-auto flex items-center justify-between px-1">
        <div>
          <p className="text-muted mb-1.5 text-[10px] leading-none font-medium">
            {data.category?.name ?? 'Sem categoria'}
          </p>
          <p className="text-success text-lg leading-none font-extrabold tracking-tight">
            {formatCommission(data.frontCommissionValue, data.frontCommissionType, data.currency)}{' '}
            Payout
          </p>
        </div>

        {visibleCountries.length > 0 ? (
          <div
            aria-label="See more countries"
            className="flex h-5 w-fit items-center"
            title="Click to see more countries"
          >
            {visibleCountries.map((country, index) => (
              <span
                className="ring-surface -ml-2 rounded-full ring-3 first:ml-0"
                key={country}
                style={{ zIndex: VISIBLE_COUNTRIES - index }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- offer covers, flags and category icons come from arbitrary hosts an admin pastes; next/image would need every one allowlisted */}
                <img
                  alt={country}
                  className="block size-5 rounded-full"
                  src={getCircleFlagUrl(country)}
                />
              </span>
            ))}
            {extraCountries > 0 ? (
              <span className="text-muted mt-1 ml-1.5 text-[10px] font-bold tabular-nums">
                +{extraCountries}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </Card>
  );
};
