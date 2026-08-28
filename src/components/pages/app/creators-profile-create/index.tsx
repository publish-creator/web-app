'use client';

import {
  CreatorsProfileCreateHeader,
  CreatorsProfileCreateIdentity,
  CreatorsProfileCreateSteps,
  CreatorsProfileCreateStyle,
} from '@/components/widgets/creators-profile-create';

export function CreatorsProfileCreatePage() {
  return (
    <div className="container-wrapper relative">
      <CreatorsProfileCreateHeader />

      <div className="grid! h-full grid-cols-[auto_480px]! gap-6">
        <div className="relative flex flex-col gap-6">
          <CreatorsProfileCreateIdentity />
          <CreatorsProfileCreateStyle />
        </div>
        <CreatorsProfileCreateSteps />
      </div>
    </div>
  );
}
