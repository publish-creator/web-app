'use client';

import { CircleInfo, Play } from '@gravity-ui/icons';
import { Avatar, Button, Card, Chip, Label, ListBox, ProgressBar, Select } from '@heroui/react';

import { VoiceWaveform, VoiceWaveMark } from './ai-library-voice-card';

import type { VoiceItem } from './ai-library.constants';

type AiLibraryVoicePreviewProps = {
  onUse: () => void;
  voice: VoiceItem;
};

export function AiLibraryVoicePreview({ onUse, voice }: AiLibraryVoicePreviewProps) {
  return (
    <Card className="sticky top-8">
      <Card.Header className="flex-row items-start gap-3">
        <VoiceWaveMark tone={voice.waveTone} waveform={voice.waveform} />
        <div className="min-w-0">
          <Card.Title>{voice.name}</Card.Title>
          <Card.Description>{voice.description}</Card.Description>
        </div>
      </Card.Header>
      <Card.Content className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-1.5">
          {[voice.age, voice.accent, voice.gender, voice.language].map((tag) => (
            <Chip key={tag} size="sm" variant="soft">
              <Chip.Label>{tag}</Chip.Label>
            </Chip>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button aria-label={`Play ${voice.name}`} isIconOnly>
            <Play className="size-4" />
          </Button>
          <VoiceWaveform bars={voice.waveform} />
          <span className="text-muted text-xs tabular-nums">{voice.duration}</span>
        </div>

        <Select className="w-full" defaultValue="intro" variant="secondary">
          <Label>Sample script</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="intro" textValue="General introduction">
                General introduction
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="product" textValue="Product walkthrough">
                Product walkthrough
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="offer" textValue="Offer recap">
                Offer recap
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>

        <VoiceMeter label="Stability" value={voice.stability} />
        <VoiceMeter label="Clarity" value={voice.clarity} />
        <VoiceMeter label="Energy" value={voice.energy} />

        {voice.assignedTo ? (
          <div className="bg-surface-secondary flex items-center gap-3 rounded-2xl p-3">
            <Avatar>
              <Avatar.Image alt="" src={voice.assignedAvatar} />
              <Avatar.Fallback>{voice.assignedTo.slice(0, 1)}</Avatar.Fallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{voice.assignedTo}</p>
              <p className="text-muted text-xs">{voice.assignedRole ?? 'Assigned avatar'}</p>
            </div>
          </div>
        ) : null}
      </Card.Content>
      <Card.Footer className="flex-col gap-3">
        <Button fullWidth onPress={onUse}>
          Use this voice
        </Button>
        <Button fullWidth variant="outline">
          Edit settings
        </Button>
        <p className="text-muted flex items-start gap-2 text-xs">
          <CircleInfo className="mt-0.5 size-3.5 shrink-0" />
          Voice and avatar consistency is checked before publishing.
        </p>
      </Card.Footer>
    </Card>
  );
}

function VoiceMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium">
        {label} ({value}%)
      </p>
      <ProgressBar aria-label={label} value={value}>
        <ProgressBar.Track>
          <ProgressBar.Fill />
        </ProgressBar.Track>
      </ProgressBar>
    </div>
  );
}
