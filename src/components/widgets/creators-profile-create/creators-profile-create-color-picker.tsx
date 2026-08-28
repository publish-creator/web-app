'use client';

import { Shuffle } from '@gravity-ui/icons';
import { CellColorPicker } from '@heroui-pro/react';
import {
  Button,
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  Label,
  ListBox,
  parseColor,
  Select,
} from '@heroui/react';
import { useState } from 'react';

import { COLOR_PRESETS } from './creators-profile-create.constants';

import type { Color, ColorChannel, ColorSpace } from '@heroui/react';

const COLOR_CHANNELS: Record<ColorSpace, ColorChannel[]> = {
  hsb: ['hue', 'saturation', 'brightness'],
  hsl: ['hue', 'saturation', 'lightness'],
  rgb: ['red', 'green', 'blue'],
};

export function shuffleBrandColor(): Color {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 50 + Math.floor(Math.random() * 50);
  const lightness = 40 + Math.floor(Math.random() * 30);

  return parseColor(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
}

interface CompleteColorPickerPanelProps {
  onShuffle: () => void;
}

export function CompleteColorPickerPanel({ onShuffle }: CompleteColorPickerPanelProps) {
  const [colorSpace, setColorSpace] = useState<ColorSpace>('hsl');

  return (
    <div className="flex w-64 flex-col gap-3">
      <ColorSwatchPicker className="justify-center" size="xs">
        {COLOR_PRESETS.map((preset) => (
          <ColorSwatchPicker.Item aria-label={preset} color={preset} key={preset}>
            <ColorSwatchPicker.Swatch />
            <ColorSwatchPicker.Indicator />
          </ColorSwatchPicker.Item>
        ))}
      </ColorSwatchPicker>

      <ColorArea
        aria-label="Área de saturação e brilho"
        className="max-w-full"
        colorSpace="hsb"
        xChannel="saturation"
        yChannel="brightness"
      >
        <ColorArea.Thumb />
      </ColorArea>

      <div className="flex items-center gap-2">
        <ColorSlider aria-label="Matiz" channel="hue" className="flex-1" colorSpace="hsb">
          <ColorSlider.Track>
            <ColorSlider.Thumb />
          </ColorSlider.Track>
        </ColorSlider>
        <Button
          aria-label="Sortear cor"
          isIconOnly
          onPress={onShuffle}
          size="sm"
          variant="tertiary"
        >
          <Shuffle className="size-4" />
        </Button>
      </div>

      <ColorSlider aria-label="Opacidade" channel="alpha" className="gap-1" colorSpace="hsb">
        <Label>Alpha</Label>
        <ColorSlider.Output className="text-muted" />
        <ColorSlider.Track>
          <ColorSlider.Thumb />
        </ColorSlider.Track>
      </ColorSlider>

      <ColorField aria-label="Hexadecimal">
        <ColorField.Group variant="secondary">
          <ColorField.Prefix>
            <ColorSwatch size="xs" />
          </ColorField.Prefix>
          <ColorField.Input />
        </ColorField.Group>
      </ColorField>

      <Select
        aria-label="Espaço de cor"
        onChange={(value) => setColorSpace(value as ColorSpace)}
        value={colorSpace}
        variant="secondary"
      >
        <Select.Trigger>
          <Select.Value className="uppercase" />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {(Object.keys(COLOR_CHANNELS) as ColorSpace[]).map((space) => (
              <ListBox.Item className="uppercase" id={space} key={space} textValue={space}>
                {space}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <div className="grid w-full grid-cols-3 items-center gap-2">
        {COLOR_CHANNELS[colorSpace].map((channel) => (
          <ColorField
            aria-label={channel}
            channel={channel}
            colorSpace={colorSpace}
            key={`${colorSpace}-${channel}`}
          >
            <ColorField.Group variant="secondary">
              <ColorField.Input />
            </ColorField.Group>
          </ColorField>
        ))}
      </div>
    </div>
  );
}

interface BrandColorPickerProps {
  label: string;
  value: Color;
  onChange: (color: Color) => void;
}

export function BrandColorPicker({ label, value, onChange }: BrandColorPickerProps) {
  return (
    <ColorPicker className="w-full" onChange={onChange} value={value}>
      <ColorPicker.Trigger
        aria-label={`${label} ${value.toString('hex')}`}
        className="bg-surface-secondary flex! h-auto w-full flex-col! items-stretch! gap-0 overflow-hidden rounded-2xl p-0 text-left"
      >
        <span
          aria-hidden
          className="block h-16 w-full"
          style={{ backgroundColor: value.toString('css') }}
        />
        <span className="flex flex-col items-start gap-0.5 px-3 py-2.5">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-muted font-mono text-xs uppercase">{value.toString('hex')}</span>
        </span>
      </ColorPicker.Trigger>
      <ColorPicker.Popover className="gap-0 p-3" placement="bottom">
        <CompleteColorPickerPanel onShuffle={() => onChange(shuffleBrandColor())} />
      </ColorPicker.Popover>
    </ColorPicker>
  );
}

interface HighlightColorPickerProps {
  label?: string;
  value: Color;
  onChange: (color: Color) => void;
}

export function HighlightColorPicker({
  label = 'Cor de destaque',
  onChange,
  value,
}: HighlightColorPickerProps) {
  return (
    <CellColorPicker className="w-full" onChange={onChange} value={value} variant="secondary">
      <CellColorPicker.Trigger>
        <CellColorPicker.Swatch />
        <CellColorPicker.Label>{label}</CellColorPicker.Label>
        <CellColorPicker.ValueDisplay />
      </CellColorPicker.Trigger>
      <CellColorPicker.Popover className="gap-0 p-3">
        <CompleteColorPickerPanel onShuffle={() => onChange(shuffleBrandColor())} />
      </CellColorPicker.Popover>
    </CellColorPicker>
  );
}
