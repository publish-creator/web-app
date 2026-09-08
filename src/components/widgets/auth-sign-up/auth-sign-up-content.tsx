'use client';

import { AuthSignUpContentEmail } from './auth-sign-up-content-email';
import { AuthSignUpContentInvite } from './auth-sign-up-content-invite';
import { AuthSignUpContentPersonal } from './auth-sign-up-content-personal';
import { AuthSignUpContentSuccess } from './auth-sign-up-content-success';
import { useAuthSignUp } from './auth-sign-up-context';

/**
 * Four steps, not eight. Country, phone and password left this flow because the API has nowhere to
 * put the first two at registration and refuses the third until the mailbox has been proved: the
 * password is set from the session the emailed link opens. Collecting them here would have shown
 * somebody a form whose answers were then thrown away.
 */
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
