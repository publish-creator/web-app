'use client';

import { useAuthSignUp } from './auth-sign-up-context';
import { AuthSignUpContentCountry } from './auth-sign-up-content-country';
import { AuthSignUpContentEmail } from './auth-sign-up-content-email';
import { AuthSignUpContentEmailConfirm } from './auth-sign-up-content-email-confirm';
import { AuthSignUpContentPassword } from './auth-sign-up-content-password';
import { AuthSignUpContentPersonal } from './auth-sign-up-content-personal';
import { AuthSignUpContentPhone } from './auth-sign-up-content-phone';
import { AuthSignUpContentPhoneConfirm } from './auth-sign-up-content-phone-confirm';
import { AuthSignUpContentSuccess } from './auth-sign-up-content-success';

export function AuthSignUpContent() {
  const { step } = useAuthSignUp();

  switch (step) {
    case 1:
      return <AuthSignUpContentEmail />;
    case 2:
      return <AuthSignUpContentEmailConfirm />;
    case 3:
      return <AuthSignUpContentPersonal />;
    case 4:
      return <AuthSignUpContentCountry />;
    case 5:
      return <AuthSignUpContentPhone />;
    case 6:
      return <AuthSignUpContentPhoneConfirm />;
    case 7:
      return <AuthSignUpContentPassword />;
    case 8:
      return <AuthSignUpContentSuccess />;
    default:
      return <AuthSignUpContentEmail />;
  }
}
