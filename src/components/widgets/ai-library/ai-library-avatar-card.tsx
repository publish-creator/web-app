'use client';

import { Check, EllipsisVertical, Filmstrip, Globe, Microphone, Play } from '@gravity-ui/icons';
import { Button, Card, Chip, Dropdown, Label } from '@heroui/react';

import type { AvatarItem } from './ai-library.constants';

type AiLibraryAvatarCardProps = {
  avatar: AvatarItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

export function AiLibraryAvatarCard({ avatar, isSelected, onSelect }: AiLibraryAvatarCardProps) {
  const isInUse = avatar.status === 'in-use';

  return (
    <Card className={isSelected ? 'ring-accent ring-2' : ''}>
      <div className="relative overflow-hidden rounded-t-2xl">
        <img alt="" className="aspect-video w-full object-cover" src={avatar.image} />
        <Chip
          className="absolute bottom-3 left-3"
          color={isInUse ? 'accent' : 'success'}
          size="sm"
          variant="soft"
        >
          <span className="size-1.5 rounded-full bg-current" />
          <Chip.Label>{isInUse ? 'In use' : 'Ready'}</Chip.Label>
        </Chip>
        {isSelected ? (
          <span className="bg-accent text-accent-foreground absolute top-3 right-3 flex size-7 items-center justify-center rounded-full">
            <Check className="size-4" />
          </span>
        ) : (
          <Dropdown>
            <Button
              aria-label={`More actions for ${avatar.name}`}
              className="bg-background/70 absolute top-3 right-3 backdrop-blur-sm"
              isIconOnly
              size="sm"
              variant="tertiary"
            >
              <EllipsisVertical className="size-4" />
            </Button>
            <Dropdown.Popover placement="bottom end">
              <Dropdown.Menu>
                <Dropdown.Item id="preview" textValue="Preview">
                  <Label>Preview</Label>
                </Dropdown.Item>
                <Dropdown.Item id="edit" textValue="Edit">
                  <Label>Edit</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        )}
      </div>
      <Card.Header className="flex-row items-center gap-2">
        <Card.Title className="min-w-0 truncate">{avatar.name}</Card.Title>
        <Chip className="shrink-0" size="sm" variant="soft">
          <Chip.Label>{avatar.role}</Chip.Label>
        </Chip>
      </Card.Header>
      <Card.Content className="text-muted flex flex-row flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <Microphone className="size-3.5" />
          {avatar.voiceId}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Globe className="size-3.5" />
          {avatar.language}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Filmstrip className="size-3.5" />
          {avatar.videos} videos
        </span>
      </Card.Content>
      <Card.Footer className="gap-2">
        {isSelected ? (
          <Button className="w-full" onPress={() => onSelect(avatar.id)}>
            <Check className="size-4" />
            Selected
          </Button>
        ) : (
          <>
            <Button className="flex-1" variant="secondary">
              <Play className="size-4" />
              Preview
            </Button>
            <Button className="flex-1" onPress={() => onSelect(avatar.id)}>
              Select
            </Button>
          </>
        )}
      </Card.Footer>
    </Card>
  );
}
