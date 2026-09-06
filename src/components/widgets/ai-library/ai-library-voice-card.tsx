'use client';

import { Check, Play } from '@gravity-ui/icons';
import { Avatar, Button, Card, Chip, cn } from '@heroui/react';

import type { VoiceItem } from './ai-library.constants';

type AiLibraryVoiceCardProps = {
  isSelected: boolean;
  onSelect: (id: string) => void;
  voice: VoiceItem;
};

export function AiLibraryVoiceCard({ isSelected, onSelect, voice }: AiLibraryVoiceCardProps) {
  return (
    <Card className={isSelected ? 'ring-accent ring-2' : ''}>
      <Card.Header className="flex-row items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <VoiceWaveMark tone={voice.waveTone} waveform={voice.waveform} />
          <div className="min-w-0">
            <Card.Title>{voice.name}</Card.Title>
            <Card.Description>{voice.description}</Card.Description>
          </div>
        </div>
        {isSelected ? (
          <span className="bg-accent text-accent-foreground flex size-7 shrink-0 items-center justify-center rounded-full">
            <Check className="size-4" />
          </span>
        ) : null}
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-1.5">
          {[voice.age, voice.accent, voice.gender, voice.language, voice.provider].map((tag) => (
            <Chip key={tag} size="sm" variant="soft">
              <Chip.Label>{tag}</Chip.Label>
            </Chip>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button aria-label={`Play ${voice.name}`} isIconOnly size="sm">
            <Play className="size-4" />
          </Button>
          <VoiceWaveform bars={voice.waveform} />
          <span className="text-muted text-xs tabular-nums">{voice.duration}</span>
        </div>
        {voice.assignedTo ? (
          <div className="flex items-center gap-2">
            <span className="bg-accent size-1.5 rounded-full" />
            <p className="text-muted text-xs">Assigned to {voice.assignedTo}</p>
            <Avatar className="size-5">
              <Avatar.Image alt="" src={voice.assignedAvatar} />
              <Avatar.Fallback>{voice.assignedTo.slice(0, 1)}</Avatar.Fallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="bg-success size-1.5 rounded-full" />
            <p className="text-muted text-xs">Available</p>
          </div>
        )}
      </Card.Content>
      <Card.Footer className="gap-2">
        <Button className="flex-1" variant="secondary">
          Preview
        </Button>
        <Button className="flex-1" variant={isSelected ? 'primary' : 'secondary'} onPress={() => onSelect(voice.id)}>
          {isSelected ? (
            <>
              <Check className="size-4" />
              Selected
            </>
          ) : (
            'Select'
          )}
        </Button>
      </Card.Footer>
    </Card>
  );
}

export function VoiceWaveMark({ tone, waveform }: { tone: string; waveform: number[] }) {
  return (
    <span
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br',
        tone,
      )}
    >
      <span className="flex h-5 items-end gap-px">
        {waveform.slice(0, 7).map((height, index) => (
          <span
            className="w-0.5 rounded-full bg-white/90"
            key={`mark-${index}`}
            style={{ height: `${Math.max(30, height)}%` }}
          />
        ))}
      </span>
    </span>
  );
}

export function VoiceWaveform({ bars }: { bars: number[] }) {
  return (
    <div className="flex h-8 flex-1 items-center gap-0.5">
      {bars.map((height, index) => (
        <span
          className="bg-accent/80 w-1 rounded-full"
          key={`wave-${index}`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}
