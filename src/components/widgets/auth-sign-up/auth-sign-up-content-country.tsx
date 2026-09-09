'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import type { Key } from '@heroui/react';
import { Autocomplete, Button, EmptyState, ListBox, SearchField, useFilter } from '@heroui/react';

import { useAuthSignUp } from './auth-sign-up-context';
import { COUNTRIES, DEFAULT_COUNTRY, getCircleFlagUrl } from './auth-sign-up.constants';
import { signUpCountrySchema } from './auth-sign-up.schemas';
import type { SignUpCountryInput } from './auth-sign-up.schemas';

export function AuthSignUpContentCountry() {
  const { contains } = useFilter({ sensitivity: 'base' });
  const { data, goToStep } = useAuthSignUp();
  const form = useForm<SignUpCountryInput>({
    resolver: zodResolver(signUpCountrySchema),
    defaultValues: { country: data.country || DEFAULT_COUNTRY },
  });
  const companyName = data.businessName || 'sua empresa';
  const isCompany = data.businessType === 'COMPANY';

  const onSubmit = (values: SignUpCountryInput) => {
    goToStep(4, { country: values.country });
  };

  return (
    <form className="flex w-full flex-col gap-8" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isCompany ? `Onde ${companyName} atua?` : 'Em qual país você está?'}
        </h1>
        <p className="text-muted max-w-101 text-sm leading-relaxed">
          {isCompany
            ? 'Selecione o país em que a empresa opera.'
            : 'É por ele que sabemos quais ofertas fazem sentido para você.'}
        </p>
      </div>

      <Controller
        control={form.control}
        name="country"
        render={({ field, fieldState }) => (
          <Autocomplete
            aria-label="País"
            className="w-full"
            isInvalid={Boolean(fieldState.error)}
            onChange={(key: Key | Key[] | null) => {
              if (typeof key === 'string') field.onChange(key);
            }}
            placeholder="Digite ou selecione o país"
            selectionMode="single"
            value={field.value}
            variant="secondary"
          >
            <Autocomplete.Trigger>
              <Autocomplete.Value />
              <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Autocomplete.Popover>
              <Autocomplete.Filter filter={contains}>
                <SearchField aria-label="Buscar país" autoFocus name="search" variant="secondary">
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="Buscar país..." />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>
                <ListBox renderEmptyState={() => <EmptyState>Nenhum país encontrado</EmptyState>}>
                  {COUNTRIES.map((country) => (
                    <ListBox.Item id={country.id} key={country.id} textValue={country.name}>
                      <span className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element -- the flags come from a remote SVG CDN that next/image cannot optimise */}
                        <img
                          alt=""
                          className="size-5 rounded-full"
                          height={20}
                          src={getCircleFlagUrl(country.id)}
                          width={20}
                        />
                        {country.name}
                      </span>
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Autocomplete.Filter>
            </Autocomplete.Popover>
          </Autocomplete>
        )}
      />

      {form.formState.errors.country ? (
        <p className="text-danger -mt-6 text-xs">{form.formState.errors.country.message}</p>
      ) : null}

      <Button fullWidth size="lg" type="submit">
        Avançar
      </Button>
    </form>
  );
}
