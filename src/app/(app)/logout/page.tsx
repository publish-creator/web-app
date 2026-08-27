'use client';

import { useSession } from '@/providers/session-provider';
import { Button } from '@heroui/react';

export default function LogoutPage() {
  const { onSignOut } = useSession();

  return (
    <div>
      <Button onPress={onSignOut}>Logout</Button>
    </div>
  );
}
