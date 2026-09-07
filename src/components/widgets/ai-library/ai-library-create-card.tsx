'use client';

import { useRouter } from 'next/navigation';

import { Plus } from '@gravity-ui/icons';
import { PressableFeedback } from '@heroui-pro/react';
import { Card } from '@heroui/react';

export function AiLibraryCreateCard() {
  const router = useRouter();

  return (
    <Card<'button'>
      aria-label="Create a new avatar"
      className="border-accent relative h-full cursor-pointer overflow-hidden border-dashed! bg-transparent! shadow-none transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
      render={(props) => (
        <button
          {...props}
          type="button"
          onClick={(event) => {
            props.onClick?.(event);
            router.push('/creators/profile/create');
          }}
        />
      )}
    >
      <PressableFeedback.Ripple />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 75% at 50% 28%, color-mix(in oklab, var(--accent) 38%, #071412) 0%, #0b0d0d 100%)',
        }}
      />
      <Card.Content className="relative flex h-full flex-col items-center justify-center gap-5 px-7 py-8 text-center">
        <span className="relative flex size-11 items-center justify-center">
          <span
            aria-hidden
            className="pointer-events-none absolute size-14 rounded-full"
            style={{
              background:
                'radial-gradient(circle, color-mix(in oklab, var(--accent) 70%, transparent) 0%, transparent 70%)',
            }}
          />
          <CreateAvatarSparkle />
        </span>
        <div className="flex flex-col gap-1.5">
          <p className="text-lg leading-tight font-semibold">Create a new avatar</p>
          <p className="text-muted max-w-52 text-sm leading-5">
            Build a consistent face, voice and personality for your content.
          </p>
        </div>
        <span className="border-accent text-accent pointer-events-none inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium">
          <Plus className="size-4" />
          Create avatar
        </span>
      </Card.Content>
    </Card>
  );
}

function CreateAvatarSparkle() {
  return (
    <svg aria-hidden className="relative size-8" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="create-avatar-sparkle" x1="6" x2="26" y1="26" y2="6">
          <stop stopColor="var(--accent)" />
          <stop offset="1" stopColor="#C084FC" />
        </linearGradient>
      </defs>
      <path
        d="M16 2Q16.8 14.2 30 16Q16.8 17.8 16 30Q15.2 17.8 2 16Q15.2 14.2 16 2Z"
        fill="url(#create-avatar-sparkle)"
      />
    </svg>
  );
}
