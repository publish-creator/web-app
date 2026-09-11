'use client';

import { Description, Tag, TagGroup } from '@heroui/react';

import {
  COUNTRIES,
  getCircleFlagUrl,
} from '@/components/widgets/auth-sign-up/auth-sign-up.constants';
import { useGetCountryGroupsQuery } from '@/store/services/settings';

import { RootOfferMultiSelect } from './root-offer-multi-select';

const GROUPS_PAGE = { page: 1, pageSize: 100 } as const;

const KNOWN = COUNTRIES.map((country) => ({
  id: country.id.toUpperCase(),
  name: country.name,
}));

function optionsFor(selected: string[]) {
  const known = new Set(KNOWN.map((country) => country.id));
  const extra = selected
    .filter((code) => !known.has(code))
    .map((code) => ({ id: code, name: code }));

  return [...KNOWN, ...extra];
}

interface RootOfferCountriesFieldProps {
  countries: string[];
  countryGroupIds: string[];
  onCountriesChange: (codes: string[]) => void;
  onGroupsChange: (ids: string[]) => void;
}

export const RootOfferCountriesField = ({
  countries,
  countryGroupIds,
  onCountriesChange,
  onGroupsChange,
}: RootOfferCountriesFieldProps) => {
  const { data: groups } = useGetCountryGroupsQuery(GROUPS_PAGE);

  const options = optionsFor(countries);

  return (
    <div className="flex flex-col gap-4">
      <RootOfferMultiSelect
        label="Grupos de países"
        onChange={onGroupsChange}
        options={(groups?.data ?? []).map((group) => ({ id: group.id, name: group.name }))}
        placeholder="Nenhum grupo"
        value={countryGroupIds}
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted text-xs font-medium">Países permitidos</span>
          <span className="text-muted text-xs tabular-nums">
            {countries.length === 0
              ? 'Nenhum país'
              : `${countries.length} ${countries.length === 1 ? 'país' : 'países'}`}
          </span>
        </div>

        <TagGroup
          aria-label="Países permitidos"
          onSelectionChange={(keys) => onCountriesChange([...keys].map(String))}
          selectedKeys={countries}
          selectionMode="multiple"
          variant="surface"
        >
          <TagGroup.List className="flex flex-wrap gap-1.5">
            {options.map((country) => (
              <Tag
                className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground flex items-center gap-1.5"
                id={country.id}
                key={country.id}
                textValue={country.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- bandeiras vêm de um CDN externo; next/image exigiria allowlist */}
                <img
                  alt=""
                  className="size-4 shrink-0 rounded-full"
                  src={getCircleFlagUrl(country.id.toLowerCase())}
                />
                {country.name}
              </Tag>
            ))}
          </TagGroup.List>
        </TagGroup>
      </div>

      <Description className="text-xs">
        Ao salvar, o servidor soma os países dos grupos escolhidos aos marcados aqui. Desmarcar um
        país que um grupo selecionado contém não tem efeito: ele volta na mesma resposta.
      </Description>
    </div>
  );
};
