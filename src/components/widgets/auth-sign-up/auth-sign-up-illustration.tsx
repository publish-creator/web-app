import Image from 'next/image';

const STEP_ILLUSTRATIONS: Record<number, { alt: string; src: string }> = {
  1: { alt: 'E-mail comercial', src: '/images/auth/01-business-email.svg' },
  2: { alt: 'Verificação de e-mail', src: '/images/auth/02-email-otp.svg' },
  3: { alt: 'Informações do negócio', src: '/images/auth/03-business-information.svg' },
  4: { alt: 'Localização do negócio', src: '/images/auth/04-business-location.svg' },
  5: { alt: 'Contato móvel', src: '/images/auth/05-mobile-contact.svg' },
  6: { alt: 'Verificação por SMS', src: '/images/auth/06-sms-otp.svg' },
  7: { alt: 'Senha segura', src: '/images/auth/07-secure-password.svg' },
  8: { alt: 'Conta criada', src: '/images/auth/08-account-created.svg' },
};

export function AuthSignUpIllustration({ step }: { step: number }) {
  const illustration = STEP_ILLUSTRATIONS[step] ?? STEP_ILLUSTRATIONS[1];

  return (
    <Image
      alt={illustration.alt}
      height={160}
      src={illustration.src}
      width={160}
    />
  );
}
