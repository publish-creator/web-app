'use client';

import { AuthSignUpProvider, AuthSignUpShell } from '@/components/widgets/auth-sign-up';

export default function SignUpPage() {
  return (
    <AuthSignUpProvider>
      <AuthSignUpShell />
    </AuthSignUpProvider>
  );
}
