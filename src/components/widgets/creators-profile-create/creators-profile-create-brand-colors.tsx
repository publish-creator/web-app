'use client';

import { Palette } from '@gravity-ui/icons';
import { DropZone } from '@heroui-pro/react';
import { Button, Modal, parseColor } from '@heroui/react';
import { useState } from 'react';

import { BrandColorPicker } from './creators-profile-create-color-picker';
import { DEFAULT_PALETTES } from './creators-profile-create.constants';

import type { Color } from '@heroui/react';

export type BrandPalette = {
  brand: Color;
  background: Color;
  text: Color;
};

interface CreatorsProfileCreateBrandColorsProps {
  palette: BrandPalette;
  onPaletteChange: (palette: BrandPalette) => void;
}

export function CreatorsProfileCreateBrandColors({
  onPaletteChange,
  palette,
}: CreatorsProfileCreateBrandColorsProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const applyPreset = (preset: (typeof DEFAULT_PALETTES)[number]) => {
    onPaletteChange({
      background: parseColor(preset.background),
      brand: parseColor(preset.brand),
      text: parseColor(preset.text),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Cores da marca</p>
        <DefaultPalettesModal onSelect={applyPreset} />
      </div>

      <div
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-2xl px-6 py-5"
        style={{ backgroundColor: palette.background.toString('css') }}
      >
        <span className="text-lg font-semibold" style={{ color: palette.brand.toString('css') }}>
          Cor da marca no título
        </span>
        <span className="text-sm" style={{ color: palette.text.toString('css') }}>
          Cor do texto no corpo
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <BrandColorPicker
          label="Marca"
          onChange={(brand) => onPaletteChange({ ...palette, brand })}
          value={palette.brand}
        />
        <BrandColorPicker
          label="Fundo"
          onChange={(background) => onPaletteChange({ ...palette, background })}
          value={palette.background}
        />
        <BrandColorPicker
          label="Texto"
          onChange={(text) => onPaletteChange({ ...palette, text })}
          value={palette.text}
        />
        <LogoDropZone file={logoFile} onFileChange={setLogoFile} />
      </div>
    </div>
  );
}

interface DefaultPalettesModalProps {
  onSelect: (palette: (typeof DEFAULT_PALETTES)[number]) => void;
}

function DefaultPalettesModal({ onSelect }: DefaultPalettesModalProps) {
  return (
    <Modal>
      <Button size="sm" variant="ghost">
        Ver paletas padrão
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-lg">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon>
                <Palette className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Paletas padrão</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {DEFAULT_PALETTES.map((preset) => (
                  <Button
                    className="h-auto justify-start p-3"
                    key={preset.id}
                    onPress={() => onSelect(preset)}
                    slot="close"
                    variant="outline"
                  >
                    <span className="flex w-full flex-col items-start gap-2">
                      <span className="flex w-full overflow-hidden rounded-lg">
                        <span className="h-8 flex-1" style={{ backgroundColor: preset.brand }} />
                        <span
                          className="h-8 flex-1"
                          style={{ backgroundColor: preset.background }}
                        />
                        <span className="h-8 flex-1" style={{ backgroundColor: preset.text }} />
                      </span>
                      <span className="text-sm font-medium">{preset.name}</span>
                    </span>
                  </Button>
                ))}
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

interface LogoDropZoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

function LogoDropZone({ file, onFileChange }: LogoDropZoneProps) {
  return (
    <DropZone className="h-full min-h-0">
      <DropZone.Input
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        onSelect={(files) => onFileChange(files[0] ?? null)}
      />
      {file ? (
        <DropZone.FileList>
          <DropZone.FileItem status="complete">
            <DropZone.FileFormatIcon format="IMG" />
            <DropZone.FileInfo>
              <DropZone.FileName>{file.name}</DropZone.FileName>
              <DropZone.FileMeta>{Math.round(file.size / 1024)} KB</DropZone.FileMeta>
            </DropZone.FileInfo>
            <DropZone.FileRemoveTrigger
              aria-label="Remover logo"
              onPress={() => onFileChange(null)}
            />
          </DropZone.FileItem>
        </DropZone.FileList>
      ) : (
        <DropZone.Area className="h-full min-h-28 px-3 py-4">
          <DropZone.Icon />
          <DropZone.Trigger>Enviar</DropZone.Trigger>
          <DropZone.Label>Logo Horizontal</DropZone.Label>
        </DropZone.Area>
      )}
    </DropZone>
  );
}
