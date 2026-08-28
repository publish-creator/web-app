'use client';

import { Palette } from '@gravity-ui/icons';
import { parseColor, Surface } from '@heroui/react';
import { useState } from 'react';

import { CreatorsProfileCreateAdvanced } from './creators-profile-create-advanced';
import { CreatorsProfileCreateBrandColors } from './creators-profile-create-brand-colors';
import { CREATE_PROFILE_STEP_IDS } from './creators-profile-create.constants';

import type { BrandPalette } from './creators-profile-create-brand-colors';
import type { Color } from '@heroui/react';

const INITIAL_PALETTE: BrandPalette = {
  background: parseColor('#F5FBFF'),
  brand: parseColor('#0086C9'),
  text: parseColor('#1D2939'),
};

export function CreatorsProfileCreateStyle() {
  const [palette, setPalette] = useState<BrandPalette>(INITIAL_PALETTE);
  const [highlightColor, setHighlightColor] = useState<Color>(INITIAL_PALETTE.brand);

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="w-full scroll-mt-24" id={CREATE_PROFILE_STEP_IDS.style}>
        <Surface className="flex w-full flex-col gap-6 rounded-3xl p-6" variant="default">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Palette className="text-muted size-3.5 shrink-0" />
              <h2 className="text-sm font-semibold">Estilo</h2>
            </div>
            <p className="text-muted bg-surface-secondary rounded-2xl p-3 text-sm">
              Cores e estilo visual da sua marca que será usado em todo o seu conteúdo.
            </p>
          </div>
          <CreatorsProfileCreateBrandColors onPaletteChange={setPalette} palette={palette} />
        </Surface>
      </div>
      <CreatorsProfileCreateAdvanced
        highlightColor={highlightColor}
        onHighlightColorChange={setHighlightColor}
      />
    </section>
  );
}
