'use client';

import { IconButton } from '@/components/base';
import { AltArrowLeftIcon } from '@solar-icons/react/linear';
import { useRouter } from 'next/navigation';

export function CreatorsProfileCreateHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <IconButton label="Voltar" onPress={() => router.back()} size="sm" variant="tertiary">
        <AltArrowLeftIcon size={24} />
      </IconButton>
      <div>
        <h1 className="text-2xl font-bold">Creators Profile</h1>
        <p className="text-muted text-base">
          Crie seu perfil de criador para começar a ganhar dinheiro.
        </p>
      </div>
    </div>
  );
}
