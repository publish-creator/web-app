'use client';

import { TextField } from '@/components/composites';
import { TextAreaField } from '@/components/composites/text-area';
import { Button, Dropdown, InfoIcon, Label, Surface, Tabs } from '@heroui/react';
import { BuildingsIcon, UserIcon } from '@solar-icons/react/bold';
import { useMemo, useState } from 'react';

import { CREATE_PROFILE_STEP_IDS } from './creators-profile-create.constants';

import type { Selection } from '@heroui/react';

const LANGUAGES = [
  { id: 'pt-BR', label: 'Português (Brasil)', flag: 'br' },
  { id: 'pt-PT', label: 'Português (Portugal)', flag: 'pt' },
  { id: 'en-US', label: 'English (US)', flag: 'us' },
  { id: 'en-GB', label: 'English (UK)', flag: 'gb' },
  { id: 'es', label: 'Español', flag: 'es' },
  { id: 'fr', label: 'Français', flag: 'fr' },
  { id: 'de', label: 'Deutsch', flag: 'de' },
  { id: 'it', label: 'Italiano', flag: 'it' },
] as const;

type LanguageId = (typeof LANGUAGES)[number]['id'];

function getCircleFlagUrl(code: string) {
  return `https://hatscripts.github.io/circle-flags/flags/${code}.svg`;
}

export function CreatorsProfileCreateIdentity() {
  return (
    <section
      className="flex w-full scroll-mt-24 flex-col items-center gap-4"
      id={CREATE_PROFILE_STEP_IDS.identity}
    >
      <Surface className="flex w-full flex-col gap-3 rounded-3xl p-6" variant="default">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <InfoIcon />
            <p className="text-sm font-semibold">Informações básicas</p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageFlagSelect />

            <Tabs>
              <Tabs.ListContainer>
                <Tabs.List aria-label="Tipo de perfil">
                  <Tabs.Tab className="flex flex-row items-center gap-2" id="individual">
                    <UserIcon size={16} />
                    Individual
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab className="flex flex-row items-center gap-2" id="company">
                    <BuildingsIcon size={16} />
                    Company
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          </div>
        </div>
        <TextField
          className="col-span-2"
          label="Name"
          placeholder="Enter your name"
          variant="secondary"
        />
        <TextAreaField
          id="description"
          label="Descrição"
          placeholder="Seja detalhado: descreva o que você (ou sua empresa) faz, serviços/produtos, diferenciais, problemas que resolve, etc."
          variant="secondary"
        />
        <TextAreaField
          id="target-audience"
          label="Público-alvo"
          placeholder="Descreva quem é seu público ideal."
          variant="secondary"
        />
        <TextAreaField
          id="favorite-contents"
          label="Conteúdos que seu público ama"
          placeholder="Descreva que tipos de conteúdo seu público mais gosta de consumir."
          variant="secondary"
        />
        <TextAreaField
          id="communication-style"
          label="Estilo de comunicação"
          placeholder="Descreva como você se comunica com seu público (ex: profissional, casual, humorado, educativo...)."
          variant="secondary"
        />
      </Surface>
    </section>
  );
}

function LanguageFlagSelect() {
  const [selected, setSelected] = useState<Selection>(new Set<LanguageId>(['pt-BR']));

  const selectedLanguage = useMemo(() => {
    const selectedId = selected === 'all' ? 'pt-BR' : ([...selected][0] as LanguageId | undefined);
    return LANGUAGES.find((language) => language.id === selectedId) ?? LANGUAGES[0];
  }, [selected]);

  return (
    <Dropdown>
      <Button
        aria-label={`Idioma: ${selectedLanguage.label}`}
        className="size-8 min-w-8 overflow-hidden rounded-full p-0"
        isIconOnly
        variant="ghost"
      >
        <img alt="" className="size-8 rounded-full" src={getCircleFlagUrl(selectedLanguage.flag)} />
      </Button>
      <Dropdown.Popover className="min-w-56" placement="bottom">
        <Dropdown.Menu
          onSelectionChange={(keys) => {
            if (keys !== 'all' && keys.size === 0) return;
            setSelected(keys);
          }}
          selectedKeys={selected}
          selectionMode="single"
        >
          {LANGUAGES.map((language) => (
            <Dropdown.Item id={language.id} key={language.id} textValue={language.label}>
              <img
                alt=""
                className="size-5 shrink-0 rounded-full"
                src={getCircleFlagUrl(language.flag)}
              />
              <Label>{language.label}</Label>
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
