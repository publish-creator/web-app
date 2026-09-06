'use client';

import { AiLibraryAvatarGrid, AiLibraryStats } from '@/components/widgets/ai-library';

export function AiLibraryAvatarsPage() {
  return (
    <div className="flex flex-col gap-4">
      <AiLibraryStats />
      <AiLibraryAvatarGrid />
    </div>
  );
}
