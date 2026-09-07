'use client';

import { usePathname, useRouter } from 'next/navigation';

import { ArrowsRotateLeft, Plus } from '@gravity-ui/icons';
import { Button, Tabs } from '@heroui/react';

import {
  AVATAR_LIBRARY_COUNT,
  VOICE_LIBRARY_COUNT,
} from '@/components/widgets/ai-library/ai-library.constants';

export function AiLibraryHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const isVoices = pathname.endsWith('/voices');

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-3xl leading-none font-bold">Avatars & Voices</h1>
        <p className="text-muted mt-0.5 text-sm">
          Choose the face and voice that will represent your content.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Tabs selectedKey={isVoices ? '/creators/profile/voices' : '/creators/profile'}>
          <Tabs.ListContainer>
            <Tabs.List aria-label="AI Library">
              <Tabs.Tab className="whitespace-nowrap" href="/creators/profile" id="/creators/profile">
                <span>{`Avatars (${AVATAR_LIBRARY_COUNT})`}</span>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab
                className="whitespace-nowrap"
                href="/creators/profile/voices"
                id="/creators/profile/voices"
              >
                <span>{`Voices (${VOICE_LIBRARY_COUNT})`}</span>
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
        {isVoices ? (
          <>
            <Button variant="outline">
              <ArrowsRotateLeft className="size-4" />
              Sync voices
            </Button>
            <Button>
              <Plus className="size-4" />
              Add voice
            </Button>
          </>
        ) : (
          <Button onPress={() => router.push('/creators/profile/create')}>
            <Plus className="size-4" />
            Create avatar
          </Button>
        )}
      </div>
    </div>
  );
}
