'use client';

import {
  CreativeCategory,
  CreativeFilter,
  CreativeHeader,
  CreativeList,
} from '@/components/widgets/creative';

export function CreativePage() {
  return (
    <div className="container-wrapper">
      <div className="flex flex-col gap-2">
        <CreativeHeader />
        <CreativeFilter />
        <CreativeCategory />
      </div>
      <CreativeList />
    </div>
  );
}
