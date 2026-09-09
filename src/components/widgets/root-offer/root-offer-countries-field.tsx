'use client';

import { Description } from '@heroui/react';

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
  icon: getCircleFlagUrl(country.id),
}));

function optionsFor(selected: string[]) {
  const known = new Set(KNOWN.map((country) => country.id));
  const extra = selected
    .filter((code) => !known.has(code))
    .map((code) => ({ id: code, name: code, icon: getCircleFlagUrl(code.toLowerCase()) }));

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
        <RootOfferMultiSelect
          label="Países permitidos"
          onChange={(codes) => onCountriesChange(codes.map((code) => code.toUpperCase()))}
          options={optionsFor(countries)}
          placeholder="Nenhum país"
          value={countries}
        />

        {countries.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {countries.map((code) => (
              <span
                className="bg-surface-secondary flex items-center gap-1.5 rounded-full px-2 py-1 text-xs"
                key={code}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- bandeiras vêm de um CDN externo; next/image exigiria allowlist */}
                <img
                  alt=""
                  className="size-3.5 rounded-full"
                  src={getCircleFlagUrl(code.toLowerCase())}
                />
                {code}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <Description className="text-xs">
        Ao salvar, o servidor soma os países dos grupos escolhidos a esta lista. Tirar daqui um país
        que um grupo selecionado contém não tem efeito: ele volta na mesma resposta.
      </Description>
    </div>
  );
};
