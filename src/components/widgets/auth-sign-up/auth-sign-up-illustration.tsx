import Image from 'next/image';

import { SIGN_UP_STEP_ILLUSTRATION } from './auth-sign-up.constants';

export function AuthSignUpIllustration({ step }: { step: number }) {
  const illustration = SIGN_UP_STEP_ILLUSTRATION[step] ?? SIGN_UP_STEP_ILLUSTRATION[1];

  return (
    <Image alt={illustration?.alt ?? ''} height={160} src={illustration?.src ?? ''} width={160} />
  );
}
