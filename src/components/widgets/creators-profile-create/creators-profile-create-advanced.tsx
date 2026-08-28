'use client';

import { TextField } from '@/components/composites';
import { TextAreaField } from '@/components/composites/text-area';
import { Sliders } from '@gravity-ui/icons';
import { CellSelect, CellSwitch, DropZone, NumberStepper } from '@heroui-pro/react';
import { Accordion, ListBox, Switch } from '@heroui/react';
import { useEffect, useState } from 'react';

import { HighlightColorPicker } from './creators-profile-create-color-picker';
import {
  CREATE_PROFILE_STEP_IDS,
  EXPAND_ADVANCED_EVENT,
  FONT_OPTIONS,
  LAYOUT_OPTIONS,
  TEXTURE_OPTIONS,
} from './creators-profile-create.constants';

import type { Color, Key } from '@heroui/react';

interface CreatorsProfileCreateAdvancedProps {
  highlightColor: Color;
  onHighlightColorChange: (color: Color) => void;
}

export function CreatorsProfileCreateAdvanced({
  highlightColor,
  onHighlightColorChange,
}: CreatorsProfileCreateAdvancedProps) {
  const [multiplePalettes, setMultiplePalettes] = useState(false);
  const [useHighlight, setUseHighlight] = useState(false);
  const [includeHashtags, setIncludeHashtags] = useState(false);
  const [allowWebPhotos, setAllowWebPhotos] = useState(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(new Set(['advanced-settings']));

  useEffect(() => {
    const expandWithoutFocus = () => {
      setExpandedKeys(new Set(['advanced-settings']));
    };

    window.addEventListener(EXPAND_ADVANCED_EVENT, expandWithoutFocus);

    return () => {
      window.removeEventListener(EXPAND_ADVANCED_EVENT, expandWithoutFocus);
    };
  }, []);

  useEffect(() => {
    if (!expandedKeys.has('advanced-settings')) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const section = document.getElementById(CREATE_PROFILE_STEP_IDS.advanced);
      const activeElement = document.activeElement;

      if (
        activeElement instanceof HTMLElement &&
        section?.contains(activeElement) &&
        activeElement !== document.body
      ) {
        activeElement.blur();
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [expandedKeys]);

  return (
    <div className="w-full scroll-mt-24" id={CREATE_PROFILE_STEP_IDS.advanced}>
      <Accordion
        className="w-full"
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
        variant="surface"
      >
        <Accordion.Item id="advanced-settings">
          <Accordion.Heading>
            <Accordion.Trigger>
              <span className="text-muted me-3 size-4 shrink-0">
                <Sliders className="size-4" />
              </span>
              Configurações avançadas
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>
              <div className="flex flex-col gap-6 pt-2">
                <div className="flex flex-col gap-4">
                  <AdvancedToggle
                    description="Permite criar múltiplas paletas (ex: dark mode + light mode) e identifica automaticamente cada uma."
                    isSelected={multiplePalettes}
                    label="Alternar entre mais de uma paleta de cores"
                    onChange={setMultiplePalettes}
                  />
                  <div className="flex flex-col gap-3">
                    <AdvancedToggle
                      description="Adiciona uma cor secundária à paleta (ex: amarelo para acentos). Quando vazia, cai para a cor da marca."
                      isSelected={useHighlight}
                      label="Usar cor de destaque"
                      onChange={setUseHighlight}
                    />
                    {useHighlight ? (
                      <HighlightColorPicker
                        onChange={onHighlightColorChange}
                        value={highlightColor}
                      />
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <OptionSelect
                    ariaLabel="Fonte do título"
                    defaultSelectedKey="inter"
                    label="Fonte do título"
                    options={FONT_OPTIONS}
                  />
                  <OptionSelect
                    ariaLabel="Fonte do corpo"
                    defaultSelectedKey="inter"
                    label="Fonte do corpo"
                    options={FONT_OPTIONS}
                  />
                  <OptionSelect
                    ariaLabel="Textura do background"
                    defaultSelectedKey="mesh-gradient"
                    label="Textura do background"
                    options={TEXTURE_OPTIONS}
                  />
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Layouts permitidos</span>
                      <p className="text-muted text-xs leading-snug">
                        Controla quais variantes do estilo podem aparecer nos seus posts.
                      </p>
                    </div>
                    <OptionSelect
                      ariaLabel="Layouts permitidos"
                      defaultSelectedKey="all"
                      options={LAYOUT_OPTIONS}
                    />
                  </div>
                </div>

                <section className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-medium">Dados do perfil no carrossel</h3>
                    <p className="text-muted text-xs leading-snug">
                      Personalize o nome, @ e foto que aparecem nos slides. Por padrão, usamos os
                      dados do Instagram.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
                    <TextField label="Nome" placeholder="Tadeu Matos" variant="secondary" />
                    <TextField label="@ do perfil" placeholder="@username" variant="secondary" />
                    <ProfilePhotoDropZone file={photoFile} onFileChange={setPhotoFile} />
                  </div>
                </section>

                <div className="flex flex-col gap-4">
                  <SimpleToggle
                    isSelected={includeHashtags}
                    label="Buscar e incluir boas hashtags na legenda"
                    onChange={setIncludeHashtags}
                  />
                  <AdvancedToggle
                    description="Fotos da web podem ter restrições de uso. Você é responsável por conferir a licença antes de publicar."
                    isSelected={allowWebPhotos}
                    label="Permitir fotos da web (sem licença livre)"
                    onChange={setAllowWebPhotos}
                  />
                  <TextAreaField
                    description="Adicionado automaticamente ao final de toda legenda gerada. Use para CTAs, hashtags fixas, etc."
                    id="default-caption"
                    label="Texto padrão no final das legendas"
                    placeholder="Ex: Siga para mais conteúdos. #marca"
                    rows={4}
                    variant="secondary"
                  />
                </div>

                <div className="flex items-start justify-between gap-6">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-sm font-medium">Tamanho padrão do carrossel</span>
                    <p className="text-muted text-xs leading-snug">
                      Quantos slides cada novo post deve ter por padrão (1 a 10).
                    </p>
                  </div>
                  <NumberStepper defaultValue={6} maxValue={10} minValue={1} size="sm">
                    <NumberStepper.Group>
                      <NumberStepper.DecrementButton />
                      <NumberStepper.Value />
                      <NumberStepper.IncrementButton />
                    </NumberStepper.Group>
                  </NumberStepper>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

interface AdvancedToggleProps {
  label: string;
  description: string;
  isSelected: boolean;
  onChange: (value: boolean) => void;
}

function AdvancedToggle({ description, isSelected, label, onChange }: AdvancedToggleProps) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-sm font-medium">{label}</span>
        <p className="text-muted text-xs leading-snug">{description}</p>
      </div>
      <Switch aria-label={label} isSelected={isSelected} onChange={onChange}>
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Content>
      </Switch>
    </div>
  );
}

interface SimpleToggleProps {
  label: string;
  isSelected: boolean;
  onChange: (value: boolean) => void;
}

function SimpleToggle({ isSelected, label, onChange }: SimpleToggleProps) {
  return (
    <CellSwitch className="w-full" isSelected={isSelected} onChange={onChange} variant="secondary">
      <Switch.Content className="w-full">
        <CellSwitch.Trigger>
          <CellSwitch.Label>{label}</CellSwitch.Label>
          <CellSwitch.Control />
        </CellSwitch.Trigger>
      </Switch.Content>
    </CellSwitch>
  );
}

interface OptionSelectProps {
  ariaLabel: string;
  defaultSelectedKey: string;
  label?: string;
  options: ReadonlyArray<{ id: string; label: string }>;
}

function OptionSelect({ ariaLabel, defaultSelectedKey, label, options }: OptionSelectProps) {
  return (
    <CellSelect
      aria-label={ariaLabel}
      className="w-full"
      defaultSelectedKey={defaultSelectedKey}
      variant="secondary"
    >
      <CellSelect.Trigger>
        {label ? <CellSelect.Label>{label}</CellSelect.Label> : null}
        <CellSelect.Value />
        <CellSelect.Indicator />
      </CellSelect.Trigger>
      <CellSelect.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item id={option.id} key={option.id} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </CellSelect.Popover>
    </CellSelect>
  );
}

interface ProfilePhotoDropZoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

function ProfilePhotoDropZone({ file, onFileChange }: ProfilePhotoDropZoneProps) {
  return (
    <DropZone className="w-full sm:w-28">
      <DropZone.Input accept="image/*" onSelect={(files) => onFileChange(files[0] ?? null)} />
      {file ? (
        <DropZone.FileList>
          <DropZone.FileItem status="complete">
            <DropZone.FileFormatIcon format="IMG" />
            <DropZone.FileInfo>
              <DropZone.FileName>{file.name}</DropZone.FileName>
            </DropZone.FileInfo>
            <DropZone.FileRemoveTrigger
              aria-label="Remover foto"
              onPress={() => onFileChange(null)}
            />
          </DropZone.FileItem>
        </DropZone.FileList>
      ) : (
        <DropZone.Area className="min-h-20 px-3 py-4">
          <DropZone.Trigger>+ Enviar foto</DropZone.Trigger>
        </DropZone.Area>
      )}
    </DropZone>
  );
}
