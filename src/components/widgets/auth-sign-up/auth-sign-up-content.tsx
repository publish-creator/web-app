'use client';

import { AuthSignUpContentEmail } from './auth-sign-up-content-email';
import { AuthSignUpContentInvite } from './auth-sign-up-content-invite';
import { AuthSignUpContentPersonal } from './auth-sign-up-content-personal';
import { AuthSignUpContentSuccess } from './auth-sign-up-content-success';
import { useAuthSignUp } from './auth-sign-up-context';

export function AuthSignUpContent() {
  const { step } = useAuthSignUp();

  switch (step) {
    case 1:
      return <AuthSignUpContentInvite />;
    case 2:
      return <AuthSignUpContentPersonal />;
    case 3:
      return <AuthSignUpContentEmail />;
    case 4:
      return <AuthSignUpContentSuccess />;
    default:
      return <AuthSignUpContentInvite />;
  }
}
