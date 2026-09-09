import { Suspense } from 'react';

import MagicLinkPage from '@/components/pages/auth/magic-link';

export default function Page() {
  return (
    <Suspense>
      <MagicLinkPage />
    </Suspense>
  );
}
