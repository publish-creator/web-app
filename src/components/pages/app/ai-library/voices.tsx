'use client';

import { AiLibraryStats, AiLibraryVoiceGrid } from '@/components/widgets/ai-library';

export function AiLibraryVoicesPage() {
  return (
    <div className="flex flex-col gap-4">
      <AiLibraryStats variant="voices" />
      <AiLibraryVoiceGrid />
    </div>
  );
}
