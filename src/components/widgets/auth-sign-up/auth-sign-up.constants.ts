export const SIGN_UP_TOTAL_STEPS = 5;
export const OTP_LENGTH = 6;
export const RESEND_COOLDOWN = 60;
export const DEFAULT_COUNTRY = 'br';

export const SIGN_UP_STEPPER_GROUPS: ReadonlyArray<{
  completedAfter: number;
  key: string;
  label: string;
  steps: readonly number[];
  subtitle: string;
}> = [
  { completedAfter: 1, key: 'invite', label: 'Convite', steps: [1], subtitle: 'Código de acesso' },
  {
    completedAfter: 2,
    key: 'information',
    label: 'Informações',
    steps: [2],
    subtitle: 'Dados do seu negócio',
  },
  {
    completedAfter: 3,
    key: 'country',
    label: 'País',
    steps: [3],
    subtitle: 'Onde você atua',
  },
  {
    completedAfter: 4,
    key: 'email',
    label: 'E-mail',
    steps: [4],
    subtitle: 'Onde falamos com você',
  },
];

export const SIGN_UP_STEP_ILLUSTRATION: Record<number, { alt: string; src: string }> = {
  1: { alt: 'Código de convite', src: '/images/auth/02-email-otp.svg' },
  2: { alt: 'Informações do negócio', src: '/images/auth/03-business-information.svg' },
  3: { alt: 'Localização do negócio', src: '/images/auth/04-business-location.svg' },
  4: { alt: 'E-mail comercial', src: '/images/auth/01-business-email.svg' },
  5: { alt: 'Conta criada', src: '/images/auth/08-account-created.svg' },
};

const NARROW_STEP = 'max-w-[450px]';
const WIDE_STEP = 'max-w-[500px]';

export const SIGN_UP_STEP_MAX_WIDTH: Record<number, string> = {
  1: NARROW_STEP,
  2: WIDE_STEP,
  3: NARROW_STEP,
  4: NARROW_STEP,
  5: WIDE_STEP,
};

export const COUNTRIES = [
  { id: 'br', name: 'Brasil' },
  { id: 'us', name: 'Estados Unidos' },
  { id: 'ca', name: 'Canadá' },
  { id: 'mx', name: 'México' },
  { id: 'ar', name: 'Argentina' },
  { id: 'pt', name: 'Portugal' },
  { id: 'gb', name: 'Reino Unido' },
  { id: 'es', name: 'Espanha' },
  { id: 'de', name: 'Alemanha' },
  { id: 'fr', name: 'França' },
  { id: 'it', name: 'Itália' },
  { id: 'co', name: 'Colômbia' },
  { id: 'cl', name: 'Chile' },
  { id: 'pe', name: 'Peru' },
  { id: 'uy', name: 'Uruguai' },
  { id: 'py', name: 'Paraguai' },
  { id: 'bo', name: 'Bolívia' },
] as const;

export const PHONE_DIAL_CODES = [
  { code: 'br', dialCode: '+55', name: 'Brasil' },
  { code: 'us', dialCode: '+1', name: 'Estados Unidos' },
  { code: 'ca', dialCode: '+1', name: 'Canadá' },
  { code: 'mx', dialCode: '+52', name: 'México' },
  { code: 'ar', dialCode: '+54', name: 'Argentina' },
  { code: 'pt', dialCode: '+351', name: 'Portugal' },
  { code: 'gb', dialCode: '+44', name: 'Reino Unido' },
  { code: 'es', dialCode: '+34', name: 'Espanha' },
  { code: 'de', dialCode: '+49', name: 'Alemanha' },
  { code: 'fr', dialCode: '+33', name: 'França' },
  { code: 'it', dialCode: '+39', name: 'Itália' },
  { code: 'co', dialCode: '+57', name: 'Colômbia' },
  { code: 'cl', dialCode: '+56', name: 'Chile' },
  { code: 'pe', dialCode: '+51', name: 'Peru' },
  { code: 'uy', dialCode: '+598', name: 'Uruguai' },
  { code: 'py', dialCode: '+595', name: 'Paraguai' },
  { code: 'bo', dialCode: '+591', name: 'Bolívia' },
] as const;

export const PASSWORD_RULES = [
  { key: 'uppercase', label: 'Pelo menos uma letra maiúscula', rule: /[A-Z]/ },
  { key: 'lowercase', label: 'Pelo menos uma letra minúscula', rule: /[a-z]/ },
  { key: 'number', label: 'Pelo menos um número', rule: /[0-9]/ },
  { key: 'special', label: 'Pelo menos um caractere especial', rule: /[#?!@$%^&*-]/ },
  { key: 'minLength', label: 'Pelo menos 8 caracteres', rule: /.{8,}/ },
] as const;

export function getCircleFlagUrl(code: string) {
  return `https://hatscripts.github.io/circle-flags/flags/${code}.svg`;
}

export function getPhoneDialCode(countryCode: string) {
  return PHONE_DIAL_CODES.find((option) => option.code === countryCode) ?? PHONE_DIAL_CODES[0];
}

export function isValidPhoneNumber(phone: string, dialCode: string) {
  const digits = phone.replace(/\D/g, '');

  if (dialCode === '+55') {
    return digits.length >= 10 && digits.length <= 11;
  }

  if (dialCode === '+1') {
    return digits.length === 10;
  }

  return digits.length >= 8;
}

export function getSignupProgress(currentStep: number) {
  const total = SIGN_UP_STEPPER_GROUPS.length;
  const activeIndex = SIGN_UP_STEPPER_GROUPS.findIndex((group) =>
    group.steps.includes(currentStep),
  );

  if (activeIndex === -1) {
    const completed = SIGN_UP_STEPPER_GROUPS.filter(
      (group) => currentStep > group.completedAfter,
    ).length;

    return Math.round((completed / total) * 100);
  }

  const group = SIGN_UP_STEPPER_GROUPS[activeIndex];

  if (!group) {
    return 0;
  }

  const stepIndex = group.steps.indexOf(currentStep);

  return Math.round(((activeIndex + (stepIndex + 1) / group.steps.length) / total) * 100);
}
