'use client';

import { CreatorsProfileHeader, CreatorsProfileList } from '@/components/widgets/creators-profile';

export function CreatorsProfilePage() {
  return (
    <div className="container-wrapper">
      <CreatorsProfileHeader />
      <CreatorsProfileList />
    </div>
  );
}
