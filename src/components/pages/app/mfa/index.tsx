'use client';

import { AuthMfaProvider, AuthMfaShell } from '@/widgets/auth-mfa';

export function MfaSetupPage() {
  return (
    <AuthMfaProvider>
      <AuthMfaShell />
    </AuthMfaProvider>
  );
}
